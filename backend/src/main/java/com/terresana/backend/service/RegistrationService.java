package com.terresana.backend.service;

import com.terresana.backend.model.Admin;
import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Registration;
import com.terresana.backend.model.enums.EventStatus;
import com.terresana.backend.model.enums.RegistrationStatus;
import com.terresana.backend.repository.RegistrationRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepo;
    private final EventService eventService;
    private final AppUserService userService;
    private final EmailService emailService;

    public RegistrationService(RegistrationRepository registrationRepo,
                               EventService eventService,
                               AppUserService userService,
                               EmailService emailService) {
        this.registrationRepo = registrationRepo;
        this.eventService = eventService;
        this.userService = userService;
        this.emailService = emailService;
    }

    public Registration register(AppUser user, Event event) {
        // Un bénévole ne peut pas s'inscrire deux fois au même événement (RG-08)
        if (registrationRepo.findByUserAndEvent(user, event).isPresent()) {
            throw new RuntimeException("Tu es déjà inscrit à cet événement.");
        }
        if (event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.FINISHED) {
            throw new RuntimeException("Impossible de s'inscrire à un événement annulé ou terminé.");
        }

        Registration reg = new Registration();
        reg.setUser(user);
        reg.setEvent(event);
        // Toute inscription reste WAITING jusqu'à validation explicite de l'admin (RG-10) ;
        // si l'événement est déjà complet, une position de liste d'attente est en plus calculée (RG-09)
        reg.setStatus(RegistrationStatus.WAITING);

        long confirmed = registrationRepo.countByEventAndStatus(event, RegistrationStatus.CONFIRMED);
        if (event.getStatus() == EventStatus.FULL || confirmed >= event.getMaxPlaces()) {
            long waitingWithPosition = registrationRepo.findByEventAndStatus(event, RegistrationStatus.WAITING)
                    .stream().filter(r -> r.getPosition() != null).count();
            reg.setPosition((int) waitingWithPosition + 1);
        }

        return registrationRepo.save(reg);
    }

    public Registration confirm(Long registrationId, Admin admin) {
        Registration reg = findById(registrationId);
        // Garde-fou capacité : rien n'empêchait jusqu'ici de confirmer plus de bénévoles que de places disponibles
        long alreadyConfirmed = registrationRepo.countByEventAndStatus(reg.getEvent(), RegistrationStatus.CONFIRMED);
        if (alreadyConfirmed >= reg.getEvent().getMaxPlaces()) {
            throw new RuntimeException("Cet événement est déjà complet, impossible de confirmer une inscription supplémentaire.");
        }
        reg.setStatus(RegistrationStatus.CONFIRMED);
        reg.setPosition(null);
        reg.setValidatedBy(admin);
        Registration saved = registrationRepo.save(reg);

        // Mettre à jour l'événement si les places sont maintenant pleines
        long confirmed = registrationRepo.countByEventAndStatus(reg.getEvent(), RegistrationStatus.CONFIRMED);
        eventService.checkAndMarkFull(reg.getEvent(), confirmed);

        // Recalculer le niveau du bénévole après confirmation (RG-18)
        long totalConfirmed = registrationRepo
                .findByUser(reg.getUser()).stream()
                .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED).count();
        userService.updateLevel(reg.getUser(), totalConfirmed);

        // RG-11 — Email de confirmation au bénévole
        emailService.sendConfirmation(reg.getUser(), reg.getEvent());

        return saved;
    }

    public Registration reject(Long registrationId, Admin admin) {
        Registration reg = findById(registrationId);
        reg.setStatus(RegistrationStatus.REFUSED);
        reg.setValidatedBy(admin);
        Registration saved = registrationRepo.save(reg);
        // RG-11 — Email de refus au bénévole
        emailService.sendRejection(reg.getUser(), reg.getEvent());
        return saved;
    }

    // RG-13 — Désinscription libre du bénévole : la ligne est supprimée (et non marquée), pour permettre
    // une éventuelle réinscription ultérieure sans violer la contrainte d'unicité bénévole/événement (RG-08)
    public void cancel(Long registrationId, AppUser user) {
        Registration reg = findById(registrationId);
        if (!reg.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Tu ne peux pas annuler l'inscription d'un autre bénévole.");
        }
        // RG-13 — Désinscription libre uniquement tant que l'événement n'est pas commencé
        if (reg.getEvent().getEventDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Impossible de se désinscrire : cet événement a déjà commencé.");
        }
        // Une place ne se libère réellement que si l'inscription annulée était CONFIRMED
        // (quitter une simple attente ne libère aucune place)
        boolean freedConfirmedSeat = reg.getStatus() == RegistrationStatus.CONFIRMED;
        Event event = reg.getEvent();
        registrationRepo.delete(reg);

        List<Registration> waitlist = registrationRepo
                .findByEventAndStatusOrderByCreatedAtAsc(event, RegistrationStatus.WAITING)
                .stream().filter(r -> r.getPosition() != null).toList();

        // Recalcule les positions de la liste d'attente restante après ce départ (RG-09)
        for (int i = 0; i < waitlist.size(); i++) {
            waitlist.get(i).setPosition(i + 1);
        }
        registrationRepo.saveAll(waitlist);

        if (freedConfirmedSeat) {
            // RG-18 — Le niveau est "calculé automatiquement" : doit refléter le nombre CONFIRMED actuel,
            // donc redescendre si une désinscription fait passer le bénévole sous un seuil (pas seulement monter)
            long remainingConfirmed = registrationRepo
                    .findByUser(user).stream()
                    .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED).count();
            userService.updateLevel(user, remainingConfirmed);

            if (!waitlist.isEmpty()) {
                // RG-12 — Promotion automatique et directe du premier de la liste d'attente (WAITING → CONFIRMED)
                Registration next = waitlist.get(0);
                next.setStatus(RegistrationStatus.CONFIRMED);
                next.setPosition(null);
                registrationRepo.save(next);
                long totalConfirmed = registrationRepo
                        .findByUser(next.getUser()).stream()
                        .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED).count();
                userService.updateLevel(next.getUser(), totalConfirmed);
                emailService.sendWaitlistPromotion(next.getUser(), event);
            }

            // Le statut de l'événement (OPEN/FULL) doit être recalculé APRÈS la promotion ci-dessus,
            // sinon on le rouvrait à tort avant que la place libérée soit reprise par le suivant en attente
            long confirmedNow = registrationRepo.countByEventAndStatus(event, RegistrationStatus.CONFIRMED);
            eventService.checkAndMarkOpen(event, confirmedNow);
        }
    }

    public List<Registration> findByUser(AppUser user) {
        return registrationRepo.findByUser(user);
    }

    public List<Registration> findByEvent(Event event) {
        return registrationRepo.findByEvent(event);
    }

    // Utilisé pour les statistiques du dashboard admin (graphiques Chart.js)
    public List<Registration> findAll() {
        return registrationRepo.findAll();
    }

    // Section 3.3 — Envoie un message groupé à tous les bénévoles encore inscrits à un événement (hors refusés)
    public int sendGroupEmail(Event event, String message) {
        List<Registration> registrations = registrationRepo.findByEvent(event).stream()
                .filter(r -> r.getStatus() != RegistrationStatus.REFUSED)
                .toList();
        registrations.forEach(r -> emailService.sendGroupMessage(r.getUser(), event, message));
        return registrations.size();
    }

    public Registration findById(Long id) {
        return registrationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription introuvable."));
    }

    public Registration findByUserAndEvent(AppUser user, Event event) {
        return registrationRepo.findByUserAndEvent(user, event)
                .orElseThrow(() -> new RuntimeException("Aucune inscription trouvée pour cet événement."));
    }
}
