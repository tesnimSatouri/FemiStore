package com.esprit.twin.gestion_avis.service;

import com.esprit.twin.gestion_avis.entity.Avis;
import com.esprit.twin.gestion_avis.repository.Avisrepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
    }
    @Override
    public List<Avis> getReviewsByNoteRange(int minNote, int maxNote) {
        // Vérifications optionnelles : s'assurer que minNote <= maxNote, etc.
        if (minNote > maxNote) {
            // Gérer l'erreur, par exemple lever une IllegalArgumentException
            throw new IllegalArgumentException("minNote cannot be greater than maxNote");
            // Ou retourner une liste vide : return Collections.emptyList();
        }
        return avisrepository.findByNoteRange(minNote, maxNote);
    }
    // Méthode pour filtrer les avis et les classer en positifs et négatifs
    @Override
    public Map<String, List<Avis>> categorizeReviewsByPositivity(int positivityThreshold) {
        // 1. Récupérer tous les avis (Attention: peut être inefficace si beaucoup d'avis)
        List<Avis> allReviews = avisrepository.findAll();

        // 2. Utiliser les Streams pour partitionner la liste
        Map<Boolean, List<Avis>> partitionedReviews = allReviews.stream()
                .collect(Collectors.partitioningBy(avis -> avis.getNote() >= positivityThreshold));
        // partitioningBy crée une Map<Boolean, List<Avis>>
        // Clé 'true' -> liste des éléments qui satisfont le prédicat (note >= seuil)
        // Clé 'false' -> liste des éléments qui ne satisfont pas le prédicat

        // 3. Créer la map de résultat avec des clés "positive" et "negative"
        Map<String, List<Avis>> categorizedReviews = new HashMap<>();
        categorizedReviews.put("positive", partitionedReviews.get(true));  // Avis positifs
        categorizedReviews.put("negative", partitionedReviews.get(false)); // Avis négatifs

        return categorizedReviews;
    }

    // --- New Method Implementations ---

    /**
     * Retrieves all reviews that have the highest note value found in the database.
     * Returns an empty list if no reviews exist.
     * @return A list of Avis entities with the maximum note.
     */
    @Override
    public List<Avis> getReviewsWithHighestNote() {
        // The repository query handles finding the max note and filtering
        return avisrepository.findReviewsWithMaxNote();
    }

    /**
     * Retrieves all reviews that have the lowest note value found in the database.
     * Returns an empty list if no reviews exist.
     * @return A list of Avis entities with the minimum note.
     */
    @Override
    public List<Avis> getReviewsWithLowestNote() {
        // The repository query handles finding the min note and filtering
        return avisrepository.findReviewsWithMinNote();
    }
    // --- End New Method Implementations ---
}
