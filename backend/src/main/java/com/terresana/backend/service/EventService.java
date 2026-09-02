package com.terresana.backend.service;

import com.terresana.backend.model.Admin;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Registration;
import com.terresana.backend.model.enums.EventStatus;
import com.terresana.backend.model.enums.RegistrationStatus;
import com.terresana.backend.repository.EventRepository;
import com.terresana.backend.repository.RegistrationRepository;
import com.terresana.backend.repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private static final Logger log = LoggerFactory.getLogger(EventService.class);
    private final EventRepository eventRepo;
    private final EventImageService eventImageService;
    private final RegistrationRepository registrationRepo;
    private final ReviewRepository reviewRepo;
    private final EmailService emailService;

    public EventService(EventRepository eventRepo, EventImageService eventImageService,
                         RegistrationRepository registrationRepo, ReviewRepository reviewRepo,
                         EmailService emailService) {
        this.eventRepo = eventRepo;
        this.eventImageService = eventImageService;
        this.registrationRepo = registrationRepo;
        this.reviewRepo = reviewRepo;
        this.emailService = emailService;
    }

    public List<Event> findAll() {
        return attachAvailablePlaces(eventRepo.findAllByOrderByEventDateAsc());
    }

    // Pagination Spring Data — utilisée par la liste événements du dashboard admin
    public Page<Event> findAllPaged(Pageable pageable) {
        return eventRepo.findAll(pageable).map(this::attachAvailablePlaces);
    }

    public Event findById(Long id) {
        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement introuvable."));
        return attachAvailablePlaces(event);
    }

    public Event create(Event event, Admin creator) {
        event.setStatus(EventStatus.OPEN);
        event.setAdmin(creator);
        // Si l'admin n'a pas fourni d'image, on en choisit une automatiquement selon le sujet de l'événement
        if (event.getImageUrl() == null || event.getImageUrl().isBlank()) {
            event.setImageUrl(eventImageService.pickImageFor(event.getTitle(), event.getDescription()));
        }
        return attachAvailablePlaces(eventRepo.save(event));
    }

    public Event update(Long id, Event updated) {
        Event event = findById(id);
        event.setTitle(updated.getTitle());
        event.setDescription(updated.getDescription());
        event.setEventDate(updated.getEventDate());
        event.setLocation(updated.getLocation());
        event.setMaxPlaces(updated.getMaxPlaces());
        event.setImageUrl(updated.getImageUrl());
        if (event.getImageUrl() == null || event.getImageUrl().isBlank()) {
            event.setImageUrl(eventImageService.pickImageFor(event.getTitle(), event.getDescription()));
        }
        return attachAvailablePlaces(eventRepo.save(event));
    }

    // Places encore libres = maxPlaces - inscriptions CONFIRMED, jamais négatif (ex: si complet exactement).
    // Calculé ici plutôt que stocké, pour ne jamais désynchroniser cette valeur du nombre réel d'inscrits.
    private Event attachAvailablePlaces(Event event) {
        long confirmed = registrationRepo.countByEventAndStatus(event, RegistrationStatus.CONFIRMED);
        event.setAvailablePlaces(Math.max(0, event.getMaxPlaces() - (int) confirmed));
        return event;
    }

    private List<Event> attachAvailablePlaces(List<Event> events) {
        events.forEach(this::attachAvailablePlaces);
        return events;
    }

    public void delete(Long id) {
        Event event = findById(id);
        // Un événement supprimé ne doit pas laisser d'inscriptions/avis orphelins en base — et sans ce
        // nettoyage préalable, la suppression échouait avec une erreur de contrainte de clé étrangère
        // dès qu'au moins un bénévole s'était inscrit (donc pour la quasi-totalité des événements de test).
        reviewRepo.deleteAll(reviewRepo.findByEvent(event));
        registrationRepo.deleteAll(registrationRepo.findByEvent(event));
        eventRepo.deleteById(id);
    }

    public Event updateStatus(Long id, EventStatus status) {
        Event event = findById(id);
        // Un événement dont la date est passée ne peut pas être "rouvert" (OPEN/FULL) : la date ne
        // change pas, donc la tâche planifiée (RG-06) le repasserait de toute façon en FINISHED
        // dans les 5 minutes — autant l'empêcher franchement plutôt que laisser un état trompeur.
        boolean isPast = event.getEventDate().isBefore(LocalDateTime.now());
        boolean reopening = status == EventStatus.OPEN || status == EventStatus.FULL;
        if (isPast && reopening) {
            throw new RuntimeException("Impossible de rouvrir un événement dont la date est déjà passée.");
        }
        // Annuler un événement laissait jusqu'ici les inscriptions CONFIRMED/WAITING inchangées :
        // le bénévole continuait à voir "Confirmé" comme si l'événement tenait toujours. On le
        // prévient par email ; son statut d'inscription reste tel quel (l'historique reste exact),
        // c'est le statut CANCELLED de l'événement lui-même qui indique désormais que ce n'est plus actif.
        if (status == EventStatus.CANCELLED && event.getStatus() != EventStatus.CANCELLED) {
            List<Registration> affected = registrationRepo.findByEvent(event).stream()
                    .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED || r.getStatus() == RegistrationStatus.WAITING)
                    .toList();
            affected.forEach(r -> emailService.sendEventCancelled(r.getUser(), event));
        }
        event.setStatus(status);
        return eventRepo.save(event);
    }

    // Appelé après chaque inscription confirmée : si places pleines → statut FULL automatique
    public void checkAndMarkFull(Event event, long confirmedCount) {
        if (confirmedCount >= event.getMaxPlaces() && event.getStatus() == EventStatus.OPEN) {
            event.setStatus(EventStatus.FULL);
            eventRepo.save(event);
        }
    }

    // Quand une place se libère : repasse FULL → OPEN si des places sont disponibles
    public void checkAndMarkOpen(Event event, long confirmedCount) {
        if (confirmedCount < event.getMaxPlaces() && event.getStatus() == EventStatus.FULL) {
            event.setStatus(EventStatus.OPEN);
            eventRepo.save(event);
        }
    }

    // RG-06 — Bascule automatiquement en FINISHED tout événement OPEN/FULL dont la date est passée.
    // Tourne toutes les 5 minutes ; CANCELLED n'est jamais touché (décision explicite de l'admin uniquement).
    @Scheduled(fixedRate = 300000)
    public void autoMarkFinishedEvents() {
        List<Event> toFinish = eventRepo.findByEventDateBeforeAndStatusIn(
                LocalDateTime.now(), List.of(EventStatus.OPEN, EventStatus.FULL));
        if (!toFinish.isEmpty()) {
            toFinish.forEach(e -> e.setStatus(EventStatus.FINISHED));
            eventRepo.saveAll(toFinish);
            log.info("{} événement(s) passés automatiquement en FINISHED", toFinish.size());
        }
    }
}
