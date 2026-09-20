package com.terresana.backend.model;

import com.terresana.backend.model.enums.EventStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Représente un événement organisé par Terra Sana.
 * Le statut passe automatiquement à FULL quand maxPlaces est atteint.
 */
@Entity
@Data
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime eventDate;

    @Column(nullable = false, length = 300)
    private String location;

    // Nombre maximum de bénévoles acceptés pour cet événement
    @Column(nullable = false)
    private Integer maxPlaces;

    @Column(length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.OPEN;

    // Administrateur créateur de l'événement (relation "crée" du diagramme de classes)
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Places encore disponibles (maxPlaces - inscriptions CONFIRMED) — calculé par EventService avant
    // l'envoi de la réponse, jamais stocké en base : ce n'est pas une vraie colonne, juste une valeur
    // dérivée pratique à afficher côté site (RG-05/RG-06), absente du dictionnaire de données.
    @Transient
    private Integer availablePlaces;
}
