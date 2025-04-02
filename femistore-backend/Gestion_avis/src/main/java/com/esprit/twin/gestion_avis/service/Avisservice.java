package com.esprit.twin.gestion_avis.service;

import com.esprit.twin.gestion_avis.entity.Avis;
import com.esprit.twin.gestion_avis.repository.Avisrepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class Avisservice implements  Iserviceimpl {
    private final Avisrepository avisrepository;

    public List<Avis> getAllReviews() {
        return avisrepository.findAll();
    }

    public Avis addReview(Avis a) {
        return avisrepository.save(a);
    }

    public void deleteReview(Long id) {
        avisrepository.deleteById(id);
    }

    public Double getAverageRating(Long productId) {
        return avisrepository.findAverageRatingByProductId(productId);
    }
    public Avis updateReview(Long id, Avis a) {
        Optional<Avis> existingReview = avisrepository.findById(id);
        if (existingReview.isPresent()) {
            Avis updatedReview = existingReview.get();
            updatedReview.setNote(a.getNote());
            updatedReview.setCommentaire(a.getCommentaire());
            updatedReview.setDate(a.getDate()); // Assure-toi que la date est bien mise à jour.
            updatedReview.setProductId(a.getProductId());
            updatedReview.setUserId(a.getUserId());
            return avisrepository.save(updatedReview);
        } else {
            throw new RuntimeException("Review not found with id: " + id);
        }
    }}
