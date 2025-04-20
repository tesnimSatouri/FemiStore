package com.esprit.twin.gestion_avis.controller;

import com.esprit.twin.gestion_avis.entity.Avis;
import com.esprit.twin.gestion_avis.service.Avisservice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/avis")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // Ajoutez cette ligne
@Slf4j // <-- ***** AJOUTER CETTE ANNOTATION *****

public class Aviscontroller {
    private final Avisservice avisservice;

    // **** NOUVEL ENDPOINT POUR PAGINATION/FILTRAGE PAR PRODUIT ****
    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<Avis>> getReviewsForProduct(
            @PathVariable Long productId,
            @RequestParam(required = false) Integer note, // Filtre par note (optionnel)
            @PageableDefault(size = 5, sort = "date") Pageable pageable) { // Valeurs par défaut: 5 par page, trié par date

        if (productId == null) {
            return ResponseEntity.badRequest().build(); // Ou gérer autrement
        }
        try {
            Page<Avis> avisPage = avisservice.getReviewsForProduct(productId, note, pageable);
            return ResponseEntity.ok(avisPage);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Ou retourner un message d'erreur plus spécifique
        }
    }
    // **** FIN NOUVEL ENDPOINT ****
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
    // **** NOUVEL ENDPOINT POUR PAGINATION GLOBALE ****
    @GetMapping("/paginated")
    public ResponseEntity<Page<Avis>> getAllReviewsPaginated(
            // Injecte l'objet Pageable construit à partir des paramètres ?page=X&size=Y&sort=prop,dir
            @PageableDefault(size = 10, sort = "date,desc") Pageable pageable) {
        log.info("Request received for paginated reviews: Page={}, Size={}, Sort={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        try {
            Page<Avis> avisPage = avisservice.getAllReviewsPaginated(pageable); // Appel de la nouvelle méthode du service
            return ResponseEntity.ok(avisPage);
        } catch (Exception e) {
            // Log l'erreur côté serveur pour le débogage
            log.error("Error fetching paginated reviews", e);
            // Retourne une erreur 500 Internal Server Error
            return ResponseEntity.internalServerError().build();
        }
    }
    // **** FIN NOUVEL ENDPOINT ****

}