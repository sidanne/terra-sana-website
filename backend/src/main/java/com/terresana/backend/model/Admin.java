package com.terresana.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<Project> projects;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<BlogPost> blogPosts;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<ContactMessage> messages;
}