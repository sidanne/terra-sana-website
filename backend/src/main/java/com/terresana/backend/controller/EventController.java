package com.terresana.backend.controller;

import com.terresana.backend.config.JwtUtil;
import com.terresana.backend.model.Admin;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.enums.EventStatus;
import com.terresana.backend.repository.AdminRepository;
import com.terresana.backend.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;
    private final JwtUtil jwtUtil;
    private final AdminRepository adminRepo;

    public EventController(EventService eventService, JwtUtil jwtUtil, AdminRepository adminRepo) {
        this.eventService = eventService;
        this.jwtUtil = jwtUtil;
        this.adminRepo = adminRepo;
    }

    // Liste publique de tous les événements (triés par date)
    @GetMapping
    public List<Event> getAll() {
        return eventService.findAll();
    }

    // Liste paginée des événements (dashboard admin) — ex: /api/events/paged?page=0&size=5
    @GetMapping("/paged")
    public Page<Event> getAllPaged(Pageable pageable) {
        return eventService.findAllPaged(pageable);
    }

    @GetMapping("/{id}")
    public Event getById(@PathVariable Long id) {
        return eventService.findById(id);
    }

    // Créer un événement (admin) — trace l'admin créateur (relation "crée" du diagramme de classes)
    @PostMapping
    public Event create(@RequestBody Event event, HttpServletRequest request) {
        return eventService.create(event, getCurrentAdmin(request));
    }

    // Récupère l'admin connecté à partir de son token JWT
    private Admin getCurrentAdmin(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide.");
        }
        String username = jwtUtil.extractUsername(header.substring(7));
        return adminRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Administrateur introuvable."));
    }

    // Modifier un événement (admin)
    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @RequestBody Event event) {
        return eventService.update(id, event);
    }

    // Supprimer un événement (admin)
    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        eventService.delete(id);
        return Map.of("message", "Événement supprimé.");
    }

    // Changer manuellement le statut d'un événement : OPEN / FULL / CANCELLED / FINISHED (admin)
    @PutMapping("/{id}/status")
    public Event updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        EventStatus status = EventStatus.valueOf(body.get("status"));
        return eventService.updateStatus(id, status);
    }
}
