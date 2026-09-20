package com.terresana.backend.controller;

import com.terresana.backend.config.VolunteerJwtUtil;
import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Registration;
import com.terresana.backend.model.Review;
import com.terresana.backend.service.AppUserService;
import com.terresana.backend.service.EventService;
import com.terresana.backend.service.PdfService;
import com.terresana.backend.service.RegistrationService;
import com.terresana.backend.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "*")
public class AppUserController {

    private final AppUserService userService;
    private final VolunteerJwtUtil jwtUtil;
    private final EventService eventService;
    private final RegistrationService registrationService;
    private final PdfService pdfService;
    private final ReviewService reviewService;

    public AppUserController(AppUserService userService, VolunteerJwtUtil jwtUtil,
                              EventService eventService, RegistrationService registrationService,
                              PdfService pdfService, ReviewService reviewService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.eventService = eventService;
        this.registrationService = registrationService;
        this.pdfService = pdfService;
        this.reviewService = reviewService;
    }

    // Inscription d'un nouveau bénévole → reçoit les infos, retourne un token JWT
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody AppUser user) {
        AppUser saved = userService.register(user);
        String token = jwtUtil.generateToken(saved.getEmail());
        return Map.of("token", token, "user", saved);
    }

    // Connexion : vérifie email + mot de passe, retourne un token JWT si OK
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        AppUser user = userService.login(body.get("email"), body.get("password"));
        String token = jwtUtil.generateToken(user.getEmail());
        return Map.of("token", token, "user", user);
    }

    // RG-04 — Demande de réinitialisation : envoie un email avec un lien à usage unique (30 min).
    // Le message reste identique que l'email existe ou non, pour ne pas révéler quels comptes existent.
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            userService.forgotPassword(body.get("email"));
        } catch (RuntimeException ignored) {
        }
        return Map.of("message", "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.");
    }

    // RG-04 — Finalise la réinitialisation à partir du jeton reçu par email
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> body) {
        userService.resetPassword(body.get("token"), body.get("newPassword"));
        return Map.of("message", "Mot de passe réinitialisé avec succès.");
    }

    // Profil du bénévole connecté (identifié par son token JWT dans le header)
    @GetMapping("/me")
    public AppUser getMe(HttpServletRequest request) {
        String email = extractEmail(request);
        return userService.findByEmail(email);
    }

    // Modification du profil du bénévole connecté
    @PutMapping("/me")
    public AppUser updateMe(@RequestBody AppUser updated, HttpServletRequest request) {
        String email = extractEmail(request);
        AppUser existing = userService.findByEmail(email);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setPhone(updated.getPhone());
        existing.setBirthDate(updated.getBirthDate());
        existing.setGender(updated.getGender());
        existing.setCity(updated.getCity());
        existing.setPostalCode(updated.getPostalCode());
        existing.setSkills(updated.getSkills());
        existing.setAvailability(updated.getAvailability());
        existing.setPreferredLanguage(updated.getPreferredLanguage());
        return userService.updateProfile(existing);
    }

    // Liste de tous les bénévoles (réservé à l'admin)
    @GetMapping
    public List<AppUser> getAll() {
        return userService.findAll();
    }

    // Nombre total de bénévoles — public, pour l'affichage des statistiques sur la page d'accueil
    // (ne renvoie qu'un compteur, aucune donnée personnelle)
    @GetMapping("/count")
    public Map<String, Long> count() {
        return Map.of("count", (long) userService.findAll().size());
    }

    // Liste paginée des bénévoles (dashboard admin) — ex: /api/volunteers/paged?page=0&size=5
    @GetMapping("/paged")
    public Page<AppUser> getAllPaged(Pageable pageable) {
        return userService.findAllPaged(pageable);
    }

    @GetMapping("/{id}")
    public AppUser getById(@PathVariable Long id) {
        return userService.findById(id);
    }

    // RG-03 — Active/désactive un compte bénévole, sans le supprimer (admin)
    @PutMapping("/{id}/toggle-active")
    public AppUser toggleActive(@PathVariable Long id) {
        return userService.toggleActive(id);
    }

    // RG-21 — Télécharge l'attestation PDF de participation du bénévole connecté pour un événement donné
    @GetMapping("/me/attestation/{eventId}")
    public ResponseEntity<byte[]> downloadAttestation(@PathVariable Long eventId, HttpServletRequest request) {
        AppUser user = userService.findByEmail(extractEmail(request));
        Event event = eventService.findById(eventId);
        Registration registration = registrationService.findByUserAndEvent(user, event);
        byte[] pdf = pdfService.generateAttestation(user, event, registration);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("attestation-" + sanitizeFilename(event.getTitle()) + ".pdf", StandardCharsets.UTF_8).build());
        return new ResponseEntity<>(pdf, headers, org.springframework.http.HttpStatus.OK);
    }

    // RG-21 — Export PDF de l'historique complet de participation du bénévole connecté
    @GetMapping("/me/participation-history")
    public ResponseEntity<byte[]> downloadParticipationHistory(HttpServletRequest request) {
        AppUser user = userService.findByEmail(extractEmail(request));
        List<Registration> registrations = registrationService.findByUser(user);
        Map<Long, Review> reviewsByEventId = reviewService.findByUser(user).stream()
                .collect(Collectors.toMap(r -> r.getEvent().getId(), r -> r, (a, b) -> a));
        byte[] pdf = pdfService.generateParticipationHistory(user, registrations, reviewsByEventId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("historique-participation.pdf", StandardCharsets.UTF_8).build());
        return new ResponseEntity<>(pdf, headers, org.springframework.http.HttpStatus.OK);
    }

    // Nettoie le titre de l'événement pour un usage sûr dans un nom de fichier
    private String sanitizeFilename(String title) {
        return title.replaceAll("[^a-zA-Z0-9-]", "_");
    }

    // Extrait l'email du bénévole à partir du token JWT dans le header Authorization
    private String extractEmail(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide.");
        }
        return jwtUtil.extractUsername(header.substring(7));
    }
}
