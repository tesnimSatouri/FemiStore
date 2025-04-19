// Fichier: src/main/java/com/esprit/twin/gestion_avis/service/Iserviceimpl.java
package com.esprit.twin.gestion_avis.service;

import com.esprit.twin.gestion_avis.entity.Avis;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface Iserviceimpl {
     List<Avis> getAllReviews();
     // Signature originale
     Avis addReview(Avis review);
     void deleteReview(Long id);
     Double getAverageRating(Long productId);
     // Signature originale
     Avis updateReview(Long id, Avis a);
     List<Avis> getReviewsByNoteRange(int minNote, int maxNote);
     Map<String, List<Avis>> categorizeReviewsByPositivity(int positivityThreshold);
     List<Avis> getReviewsWithHighestNote();
     List<Avis> getReviewsWithLowestNote();

}