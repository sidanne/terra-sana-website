package com.terresana.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @Column(length = 5000)
    private String message;

    private LocalDateTime createdAt;
    private boolean isRead = false;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;
}