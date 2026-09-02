package com.terresana.backend.model;

import com.terresana.backend.model.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Lien entre un bénévole (AppUser) et un événement (Event).
 * Un bénévole ne peut avoir qu'une seule inscription par événement (RG-08).
 */
@Entity
@Data
@Table(name = "registrations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "event_id"}))
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // Toute nouvelle inscription reste WAITING jusqu'à validation explicite de l'admin (RG-10)
    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.WAITING;

    // Position dans la liste d'attente (1 = premier) — renseignée seulement si l'événement était complet à l'inscription (RG-09)
    private Integer position;

    // Admin ayant confirmé ou refusé l'inscription — null tant qu'elle n'a pas été traitée (RG-10)
    @ManyToOne
    @JoinColumn(name = "validated_by_id")
    private Admin validatedBy;

    private LocalDateTime createdAt = LocalDateTime.now();
}
