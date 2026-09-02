package com.terresana.backend.service;

import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.enums.Level;
import com.terresana.backend.repository.AppUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AppUserService {

    private final AppUserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AppUserService(AppUserRepository userRepo, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public AppUser register(AppUser user) {
        // Vérification unicité de l'email avant de sauvegarder (RG-01)
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Un compte existe déjà avec cet email.");
        }
        // RG-02 — Le mot de passe compte au moins 8 caractères (contrôle backend, pas seulement frontend)
        if (user.getPassword() == null || user.getPassword().length() < 8) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 8 caractères.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setLevel(Level.BRONZE);
        return userRepo.save(user);
    }

    public AppUser login(String email, String password) {
        AppUser user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email introuvable."));
        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new RuntimeException("Ce compte a été désactivé.");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect.");
        }
        return user;
    }

    public AppUser findByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Bénévole introuvable."));
    }

    public AppUser findById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Bénévole introuvable."));
    }

    public AppUser updateProfile(AppUser user) {
        return userRepo.save(user);
    }

    // Recalcule et met à jour le niveau du bénévole selon ses participations (RG-18)
    // Envoie un email si le niveau change (RG-19)
    public void updateLevel(AppUser user, long confirmedCount) {
        Level oldLevel = user.getLevel();
        Level newLevel;
        if (confirmedCount >= 7) {
            newLevel = Level.OR;
        } else if (confirmedCount >= 3) {
            newLevel = Level.ARGENT;
        } else {
            newLevel = Level.BRONZE;
        }
        user.setLevel(newLevel);
        userRepo.save(user);
        // Envoyer l'email de félicitations uniquement si le niveau a réellement progressé (jamais sur une baisse,
        // ex. après une désinscription qui repasse le bénévole sous un seuil — RG-18 recalcule aussi à la baisse)
        if (newLevel.ordinal() > oldLevel.ordinal()) {
            emailService.sendLevelChange(user, newLevel.name());
        }
    }

    // RG-04 — Génère un jeton à usage unique (valable 30 min) et envoie le lien de réinitialisation par email
    public void forgotPassword(String email) {
        AppUser user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Aucun compte associé à cet email."));
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepo.save(user);
        emailService.sendPasswordReset(user, token);
    }

    // RG-04 — Vérifie le jeton (existence + validité de 30 min) puis met à jour le mot de passe (RG-02)
    public void resetPassword(String token, String newPassword) {
        AppUser user = userRepo.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Lien de réinitialisation invalide."));
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Ce lien a expiré. Merci de refaire une demande.");
        }
        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("Le mot de passe doit contenir au moins 8 caractères.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepo.save(user);
    }

    public java.util.List<AppUser> findAll() {
        return userRepo.findAll();
    }

    // RG-03 — Active/désactive un compte bénévole sans le supprimer, pour conserver l'historique (admin)
    public AppUser toggleActive(Long id) {
        AppUser user = findById(id);
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        return userRepo.save(user);
    }

    // Pagination Spring Data — utilisée par la liste bénévoles du dashboard admin
    public Page<AppUser> findAllPaged(Pageable pageable) {
        return userRepo.findAll(pageable);
    }
}
