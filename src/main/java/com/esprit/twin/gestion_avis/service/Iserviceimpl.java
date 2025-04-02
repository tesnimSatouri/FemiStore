package com.esprit.twin.gestion_avis.service;

import com.esprit.twin.gestion_avis.entity.Avis;

import java.util.List;

public interface Iserviceimpl {
     List<Avis> getAllReviews();
     Avis addReview(Avis review);
     void deleteReview(Long id);
     Double getAverageRating(Long productId);
     Avis updateReview(Long id, Avis a);
     List<Avis> getReviewsByNoteRange(int minNote, int maxNote);

}
