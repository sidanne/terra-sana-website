package com.terresana.backend.repository;

import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Registration;
import com.terresana.backend.model.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Vérifier si un bénévole est déjà inscrit à un événement (RG-07)
    Optional<Registration> findByUserAndEvent(AppUser user, Event event);

    // Toutes les inscriptions d'un événement (pour l'admin)
    List<Registration> findByEvent(Event event);

    // Toutes les inscriptions d'un bénévole (pour son espace perso)
    List<Registration> findByUser(AppUser user);

    // Inscrits d'un événement selon leur statut (ex. tous les CONFIRMED)
    List<Registration> findByEventAndStatus(Event event, RegistrationStatus status);

    // Compter les places prises (CONFIRMED) pour savoir si l'événement est plein
    long countByEventAndStatus(Event event, RegistrationStatus status);

    // Liste d'attente triée par date d'inscription (le plus ancien passe en premier)
    List<Registration> findByEventAndStatusOrderByCreatedAtAsc(Event event, RegistrationStatus status);
}
