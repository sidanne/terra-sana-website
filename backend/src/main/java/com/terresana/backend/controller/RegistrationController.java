package com.terresana.backend.controller;

import com.terresana.backend.config.JwtUtil;
import com.terresana.backend.config.VolunteerJwtUtil;
import com.terresana.backend.model.Admin;
import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Registration;
import com.terresana.backend.repository.AdminRepository;
import com.terresana.backend.service.AppUserService;
import com.terresana.backend.service.EventService;
import com.terresana.backend.service.PdfService;
import com.terresana.backend.service.RegistrationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final AppUserService userService;
    private final EventService eventService;
    private final VolunteerJwtUtil jwtUtil;
    private final JwtUtil adminJwtUtil;
    private final AdminRepository adminRepo;
    private final PdfService pdfService;

    public RegistrationController(RegistrationService registrationService,
                                  AppUserService userService,
                                  EventService eventService,
                                  VolunteerJwtUtil jwtUtil,
                                  JwtUtil adminJwtUtil,
                                  AdminRepository adminRepo,
                                  PdfService pdfService) {
        this.registrationService = registrationService;
        this.userService = userService;
        this.eventService = eventService;
        this.jwtUtil = jwtUtil;
        this.adminJwtUtil = adminJwtUtil;
        this.adminRepo = adminRepo;
        this.pdfService = pdfService;
    }

    // S'inscrire à un événement (bénévole connecté)
    @PostMapping
    public Registration register(@RequestBody Map<String, Long> body, HttpServletRequest request) {
        AppUser user = getCurrentUser(request);
        Event event = eventService.findById(body.get("eventId"));
        return registrationService.register(user, event);
    }

    // Voir ses propres inscriptions (bénévole connecté)
    @GetMapping("/my")
    public List<Registration> myRegistrations(HttpServletRequest request) {
        AppUser user = getCurrentUser(request);
        return registrationService.findByUser(user);
    }

    // Se désinscrire d'un événement (bénévole connecté)
    @DeleteMapping("/{id}")
    public Map<String, String> cancel(@PathVariable Long id, HttpServletRequest request) {
        AppUser user = getCurrentUser(request);
        registrationService.cancel(id, user);
        return Map.of("message", "Inscription annulée.");
    }

    // Voir tous les inscrits d'un événement (admin)
    @GetMapping("/event/{eventId}")
    public List<Registration> getByEvent(@PathVariable Long eventId) {
        Event event = eventService.findById(eventId);
        return registrationService.findByEvent(event);
    }

    // Toutes les inscriptions, utilisées pour les statistiques du dashboard admin (admin)
    @GetMapping
    public List<Registration> getAll() {
        return registrationService.findAll();
    }

    // RG-21 — Export PDF de la liste des inscrits à un événement (réservé à l'admin)
    @GetMapping("/event/{eventId}/export")
    public ResponseEntity<byte[]> exportRegistrations(@PathVariable Long eventId) {
        Event event = eventService.findById(eventId);
        List<Registration> registrations = registrationService.findByEvent(event);
        byte[] pdf = pdfService.generateRegistrationsList(event, registrations);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("inscrits-" + event.getTitle().replaceAll("[^a-zA-Z0-9-]", "_") + ".pdf", StandardCharsets.UTF_8).build());
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    // Section 3.3 — Envoyer un email groupé à tous les inscrits d'un événement (admin)
    @PostMapping("/event/{eventId}/group-email")
    public Map<String, Object> sendGroupEmail(@PathVariable Long eventId, @RequestBody Map<String, String> body) {
        Event event = eventService.findById(eventId);
        int count = registrationService.sendGroupEmail(event, body.get("message"));
        return Map.of("message", "Email envoyé à " + count + " bénévole(s).", "count", count);
    }

    // Confirmer une inscription (admin) → passe WAITING → CONFIRMED (RG-10)
    @PutMapping("/{id}/confirm")
    public Registration confirm(@PathVariable Long id, HttpServletRequest request) {
        return registrationService.confirm(id, getCurrentAdmin(request));
    }

    // Refuser une inscription (admin) → passe WAITING → REFUSED (RG-10)
    @PutMapping("/{id}/reject")
    public Registration reject(@PathVariable Long id, HttpServletRequest request) {
        return registrationService.reject(id, getCurrentAdmin(request));
    }

    // Récupère le bénévole connecté à partir de son token JWT
    private AppUser getCurrentUser(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide.");
        }
        String email = jwtUtil.extractUsername(header.substring(7));
        return userService.findByEmail(email);
    }

    // Récupère l'admin connecté à partir de son token JWT (RG-10 : trace qui a validé/refusé)
    private Admin getCurrentAdmin(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide.");
        }
        String username = adminJwtUtil.extractUsername(header.substring(7));
        return adminRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Administrateur introuvable."));
    }
}
