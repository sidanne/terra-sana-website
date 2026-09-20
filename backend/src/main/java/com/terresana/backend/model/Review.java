package com.terresana.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Avis laissé par un bénévole après un événement FINISHED.
 * Un seul avis par bénévole par événement (RG-17).
 * Seuls les participants confirmés peuvent noter (RG-15).
 */
@Entity
@Data
@Table(name = "reviews",
       uniqueConstraints = @UniqueConstraint(name = "uq_review_user_event", columnNames = {"user_id", "event_id"}))
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // Note obligatoirement entre 1 et 5 (RG-18)
    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
