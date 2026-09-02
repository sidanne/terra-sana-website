package com.terresana.backend.service;

import com.terresana.backend.model.AppUser;
import com.terresana.backend.model.Event;
import com.terresana.backend.model.Review;
import com.terresana.backend.model.enums.EventStatus;
import com.terresana.backend.model.enums.RegistrationStatus;
import com.terresana.backend.repository.RegistrationRepository;
import com.terresana.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final RegistrationRepository registrationRepo;

    public ReviewService(ReviewRepository reviewRepo, RegistrationRepository registrationRepo) {
        this.reviewRepo = reviewRepo;
        this.registrationRepo = registrationRepo;
    }

    public Review addReview(AppUser user, Event event, int rating, String comment) {
        // Un avis ne peut être laissé que sur un événement terminé (RG-15)
        if (event.getStatus() != EventStatus.FINISHED) {
            throw new RuntimeException("Tu ne peux laisser un avis qu'après la fin de l'événement.");
        }
        // Seul un participant confirmé peut laisser un avis (RG-14)
        boolean participated = registrationRepo.findByUserAndEvent(user, event)
                .map(r -> r.getStatus() == RegistrationStatus.CONFIRMED)
                .orElse(false);
        if (!participated) {
            throw new RuntimeException("Tu dois avoir participé à l'événement pour laisser un avis.");
        }
        // Un seul avis par bénévole par événement (RG-16)
        if (reviewRepo.existsByUserAndEvent(user, event)) {
            throw new RuntimeException("Tu as déjà laissé un avis pour cet événement.");
        }
        // La note doit être comprise entre 1 et 5 (RG-17)
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("La note doit être comprise entre 1 et 5.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setEvent(event);
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepo.save(review);
    }

    public List<Review> findByEvent(Event event) {
        return reviewRepo.findByEvent(event);
    }

    public List<Review> findByUser(AppUser user) {
        return reviewRepo.findByUser(user);
    }

    // Calcule la note moyenne d'un événement à partir de tous ses avis
    public List<Review> findAll() {
        return reviewRepo.findAll();
    }

    public double getAverageRating(Event event) {
        List<Review> reviews = reviewRepo.findByEvent(event);
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
    }
}
