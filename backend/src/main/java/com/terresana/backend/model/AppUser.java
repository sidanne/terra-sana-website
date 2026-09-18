package com.terresana.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.terresana.backend.model.enums.Level;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Représente un bénévole inscrit sur le site.
 * L'email est unique et sert d'identifiant de connexion (RG-01).
 */
@Entity
@Data
@Table(name = "app_users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    // Mot de passe stocké haché en BCrypt — jamais en clair (RG-02), ni même le hash dans une réponse JSON.
    // WRITE_ONLY (pas @JsonIgnore) : le champ doit rester acceptable en entrée (inscription) tout en
    // étant systématiquement omis en sortie — @JsonIgnore bloquerait aussi la désérialisation.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    // Champs facultatifs du profil
    private String phone;
    private LocalDate birthDate;
    private String gender;
    private String city;
    @Column(length = 20)
    private String postalCode;
    private String skills;
    private String availability;
    private String preferredLanguage = "fr";

    // Niveau calculé automatiquement selon les participations (RG-18)
    @Enumerated(EnumType.STRING)
    private Level level = Level.BRONZE;

    // Compte actif — désactivable sans suppression pour conserver l'historique (RG-03)
    private Boolean isActive = true;

    // Champs pour la réinitialisation de mot de passe par email (RG-04) —
    // le jeton lui-même ne doit jamais fuiter dans une réponse JSON (permettrait de prendre le compte)
    @JsonIgnore
    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    private LocalDateTime createdAt = LocalDateTime.now();
}
