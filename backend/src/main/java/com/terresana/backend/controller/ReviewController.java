package com.terresana.backend.controller;

import com.terresana.backend.config.VolunteerJwtUtil;
import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Review;
import com.terresana.backend.service.AppUserService;
import com.terresana.backend.service.EventService;
import com.terresana.backend.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    private final AppUserService userService;
    private final EventService eventService;
    private final VolunteerJwtUtil jwtUtil;

    public ReviewController(ReviewService reviewService,
                            AppUserService userService,
                            EventService eventService,
                            VolunteerJwtUtil jwtUtil) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.eventService = eventService;
        this.jwtUtil = jwtUtil;
    }

    // Laisser un avis sur un événement terminé (bénévole connecté)
    @PostMapping
    public Review addReview(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        AppUser user = getCurrentUser(request);
        Event event = eventService.findById(Long.parseLong(body.get("eventId").toString()));
        int rating = Integer.parseInt(body.get("rating").toString());
        String comment = (String) body.get("comment");
        return reviewService.addReview(user, event, rating, comment);
    }

    // Tous les avis d'un événement + note moyenne (public)
    @GetMapping("/event/{eventId}")
    public Map<String, Object> getByEvent(@PathVariable Long eventId) {
        Event event = eventService.findById(eventId);
        List<Review> reviews = reviewService.findByEvent(event);
        double average = reviewService.getAverageRating(event);
        return Map.of("reviews", reviews, "average", average);
    }

    // Mes avis (bénévole connecté)
    @GetMapping("/my")
    public List<Review> myReviews(HttpServletRequest request) {
        AppUser user = getCurrentUser(request);
        return reviewService.findByUser(user);
    }

    // Tous les avis de tous les événements (admin)
    @GetMapping
    public List<Review> getAll() {
        return reviewService.findAll();
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
}
