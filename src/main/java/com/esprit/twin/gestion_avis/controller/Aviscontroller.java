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
            // Paramètre pour le seuil, optionnel, défaut à 3
            @RequestParam(defaultValue = "3") int threshold) {

        if (threshold < 0) { // Ajout d'une validation simple
            // Retourner une erreur Bad Request si le seuil est invalide
            return ResponseEntity.badRequest().build(); // Ou retourner un message d'erreur plus explicite
        }
        Map<String, List<Avis>> categorizedReviews = avisservice.categorizeReviewsByPositivity(threshold);
        return ResponseEntity.ok(categorizedReviews);
    }
}
