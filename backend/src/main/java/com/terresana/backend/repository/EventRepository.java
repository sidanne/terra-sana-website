package com.terresana.backend.repository;

import com.terresana.backend.model.Event;
import com.terresana.backend.model.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // Liste des événements selon leur statut (ex. tous les OPEN)
    List<Event> findByStatus(EventStatus status);

    // Liste complète triée par date croissante (les prochains en premier)
    List<Event> findAllByOrderByEventDateAsc();

    // RG-06 — Événements dont la date est passée mais qui ne sont pas encore FINISHED/CANCELLED
    List<Event> findByEventDateBeforeAndStatusIn(LocalDateTime date, List<EventStatus> statuses);
}
