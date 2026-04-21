package com.terresana.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 5000)
    private String content;
    private String image;
    private Boolean isPublished;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;
}