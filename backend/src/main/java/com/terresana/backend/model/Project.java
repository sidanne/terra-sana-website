package com.terresana.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String link;
    private String documentationLink;
    private String image;
    private String category;
    private Boolean isActive;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;
}