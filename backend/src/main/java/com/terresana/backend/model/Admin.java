package com.terresana.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "admin",
       uniqueConstraints = @UniqueConstraint(name = "uq_admin_username", columnNames = "username"))
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    // Ne jamais exposer le hash même via une réponse JSON (RG-02) — surtout maintenant qu'Admin
    // est sérialisé en tant qu'objet imbriqué dans Event.admin / Registration.validatedBy.
    // WRITE_ONLY (pas @JsonIgnore) : reste acceptable en entrée si un jour un endpoint désérialise
    // un Admin complet — @JsonIgnore bloquerait aussi la désérialisation, pas seulement la sortie.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    // @JsonIgnore : évite la boucle de sérialisation Event/Registration → Admin → ces listes → ... → Admin
    // (ces collections ne sont de toute façon jamais consommées depuis un objet Admin imbriqué côté frontend)
    @JsonIgnore
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<Project> projects;

    @JsonIgnore
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<BlogPost> blogPosts;

    @JsonIgnore
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<ContactMessage> messages;
}
