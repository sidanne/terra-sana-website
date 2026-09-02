package com.terresana.backend.repository;

import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Tous les avis d'un événement (pour afficher la note moyenne)
    List<Review> findByEvent(Event event);

    // Tous les avis laissés par un bénévole (pour son historique)
    List<Review> findByUser(AppUser user);

    // Vérifier qu'un bénévole n'a pas déjà laissé un avis sur cet événement (RG-16)
    boolean existsByUserAndEvent(AppUser user, Event event);
}
