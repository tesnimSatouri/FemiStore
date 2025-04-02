package com.esprit.twin.gestion_avis.controller;

import com.esprit.twin.gestion_avis.entity.Avis;
import com.esprit.twin.gestion_avis.service.Avisservice;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
}
