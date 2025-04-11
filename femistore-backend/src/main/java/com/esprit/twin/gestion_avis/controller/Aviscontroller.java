package com.esprit.twin.gestion_avis.controller;

import com.esprit.twin.gestion_avis.entity.Avis;
import com.esprit.twin.gestion_avis.service.Avisservice;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/avis")
@RequiredArgsConstructor
public class Aviscontroller {
    private final Avisservice avisservice;

    @GetMapping
    public List<Avis> getAllReviews() {
        return avisservice.getAllReviews();
    }

    @PostMapping
    public Avis addReview(@RequestBody Avis a) {
        return avisservice.addReview(a);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        avisservice.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/average/{productId}")
    public Double getAverageRating(@PathVariable Long productId) {
        return avisservice.getAverageRating(productId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Avis> updateReview(@PathVariable Long id, @RequestBody Avis a) {
        Avis updatedReview = avisservice.updateReview(id, a);
        return ResponseEntity.ok(updatedReview);
    }

    @GetMapping("/filter")
    public List<Avis> getReviewsByNoteRange(@RequestParam int min, @RequestParam int max) {
        return avisservice.getReviewsByNoteRange(min, max);
    }

    @GetMapping("/categorized")
    public ResponseEntity<Map<String, List<Avis>>> getCategorizedReviews(
            @RequestParam(defaultValue = "3") int threshold) {

        if (threshold < 0) {
            return ResponseEntity.badRequest().build();
        }
        Map<String, List<Avis>> categorizedReviews = avisservice.categorizeReviewsByPositivity(threshold);
        return ResponseEntity.ok(categorizedReviews);
    }

    @GetMapping("/highest-rated")
    public ResponseEntity<List<Avis>> getHighestRatedReviews() {
        List<Avis> reviews = avisservice.getReviewsWithHighestNote();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/lowest-rated")
    public ResponseEntity<List<Avis>> getLowestRatedReviews() {
        List<Avis> reviews = avisservice.getReviewsWithLowestNote();
        return ResponseEntity.ok(reviews);
    }

}