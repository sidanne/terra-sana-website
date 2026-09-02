package com.terresana.backend.controller;

import com.terresana.backend.config.JwtUtil;
import com.terresana.backend.model.Admin;
import com.terresana.backend.repository.AdminRepository;
import com.terresana.backend.service.EmailService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AdminRepository adminRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthController(AdminRepository adminRepo, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.adminRepo = adminRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin non trouve"));
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }
        String token = jwtUtil.generateToken(username);
        return Map.of("token", token);
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> body) {
        Admin admin = new Admin();
        admin.setUsername(body.get("username"));
        admin.setPassword(passwordEncoder.encode(body.get("password")));
        adminRepo.save(admin);
        return Map.of("message", "Admin cree avec succes");
    }
    // L'identité vient toujours du token, jamais d'un champ "username" envoyé par le client :
    // sinon un changement de nom d'utilisateur (Admin.updateProfile) désynchronise ce formulaire,
    // qui envoyait jusqu'ici un "admin" codé en dur.
    @PutMapping("/changePassword")
    public Map<String, String> changePassword(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide.");
        }
        String username = jwtUtil.extractUsername(header.substring(7));
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin non trouve"));
        if (!passwordEncoder.matches(oldPassword, admin.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }
        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 8 caractères.");
        }
        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepo.save(admin);
        return Map.of("message", "Mot de passe change avec succes");
    }

    // Admin.forgotPassword() (diagramme de classes) — envoie un jeton JWT à usage unique (30 min) par email
    @PostMapping("/forgotPassword")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> body) {
        Admin admin = adminRepo.findByUsername(body.get("username"))
                .orElseThrow(() -> new RuntimeException("Admin non trouve"));
        String token = jwtUtil.generatePasswordResetToken(admin.getUsername());
        emailService.sendAdminPasswordReset(admin, token);
        return Map.of("message", "Email de réinitialisation envoyé.");
    }

    // Admin.resetPassword() (diagramme de classes) — vérifie le jeton (signature + expiration + purpose) puis met à jour
    @PostMapping("/resetPassword")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 8 caractères.");
        }
        String username;
        try {
            username = jwtUtil.extractUsernameFromResetToken(body.get("token"));
        } catch (JwtException e) {
            throw new RuntimeException("Ce lien est invalide ou a expiré.");
        }
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin non trouve"));
        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepo.save(admin);
        return Map.of("message", "Mot de passe réinitialisé avec succès");
    }

    // Admin.updateProfile() (diagramme de classes) — changer son nom d'utilisateur
    @PutMapping("/updateProfile")
    public Map<String, String> updateProfile(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide.");
        }
        String currentUsername = jwtUtil.extractUsername(header.substring(7));
        Admin admin = adminRepo.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Admin non trouve"));
        String newUsername = body.get("username");
        if (newUsername == null || newUsername.isBlank()) {
            throw new RuntimeException("Le nom d'utilisateur ne peut pas être vide.");
        }
        admin.setUsername(newUsername);
        adminRepo.save(admin);
        return Map.of("message", "Profil mis à jour avec succès", "token", jwtUtil.generateToken(newUsername));
    }
}