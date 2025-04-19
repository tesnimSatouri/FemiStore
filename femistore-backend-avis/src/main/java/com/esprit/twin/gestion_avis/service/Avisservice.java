package com.esprit.twin.gestion_avis.service;

import com.esprit.twin.gestion_avis.entity.Avis;
import com.esprit.twin.gestion_avis.repository.Avisrepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class Avisservice implements Iserviceimpl {

    private final Avisrepository avisrepository;
    private final EmailService emailService;

    // Injection des valeurs de configuration
    @Value("${avis.alert.critical-threshold}")
    private double criticalThreshold;

    @Value("${avis.alert.significant-drop}")
    private double significantDrop;

    @Override
    public List<Avis> getAllReviews() {
        return avisrepository.findAll();
    }
    // **** NOUVELLE MÉTHODE POUR PAGINATION/FILTRAGE ****
    public Page<Avis> getReviewsForProduct(Long productId, Integer note, Pageable pageable) {
        if (productId == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        if (note != null) {
            log.info("Fetching reviews for product ID {} with note {} - Page: {}, Size: {}", productId, note, pageable.getPageNumber(), pageable.getPageSize());
            // Assurez-vous que la note est dans une plage valide si nécessaire (ex: 1-5)
            if (note < 1 || note > 5) {
                throw new IllegalArgumentException("Note filter must be between 1 and 5.");
            }
            return avisrepository.findByProductIdAndNote(productId, note, pageable);
        } else {
            log.info("Fetching reviews for product ID {} (all notes) - Page: {}, Size: {}", productId, pageable.getPageNumber(), pageable.getPageSize());
            return avisrepository.findByProductId(productId, pageable);
        }
    }
    // **** FIN NOUVELLE MÉTHODE ****
    @Override
    @Transactional
    // Signature originale
    public Avis addReview(Avis a) {
        if (a.getProductId() == null) {
            log.warn("Tentative d'ajout d'un avis sans productId. Avis : {}", a);
            throw new IllegalArgumentException("L'ID du produit ne peut pas être nul pour un avis.");
        }
        Long productId = a.getProductId();
        Double oldAverage = avisrepository.findAverageRatingByProductId(productId);
        log.debug("Produit ID {}: Ancienne moyenne = {}", productId, oldAverage);

        Avis savedAvis = avisrepository.save(a);
        log.info("Avis ajouté avec ID : {} pour Produit ID : {}", savedAvis.getId(), productId);

        Double newAverage = avisrepository.findAverageRatingByProductId(productId);
        log.debug("Produit ID {}: Nouvelle moyenne = {}", productId, newAverage);

        checkAndSendAlert(productId, oldAverage, newAverage);

        return savedAvis;
    }
    @Override
    @Transactional
    public void deleteReview(Long id) {
        avisrepository.deleteById(id);
        log.info("Avis supprimé avec ID : {}", id);
    }

    @Override
    public Double getAverageRating(Long productId) {
        return avisrepository.findAverageRatingByProductId(productId);
    }

    @Override
    @Transactional
    public Avis updateReview(Long id, Avis a) {
        Optional<Avis> existingReview = avisrepository.findById(id);
        if (existingReview.isPresent()) {
            Avis updatedReview = existingReview.get();
            Long productId = updatedReview.getProductId();
            Double oldAverageBeforeUpdate = null;
            boolean productIdChanged = !productId.equals(a.getProductId());

            if (!productIdChanged) {
                oldAverageBeforeUpdate = avisrepository.findAverageRatingByProductId(productId);
                log.debug("[UPDATE] Produit ID {}: Moyenne avant mise à jour = {}", productId, oldAverageBeforeUpdate);
            } else {
                log.warn("[UPDATE] Le ProductID a changé pour l'avis ID {}. La logique d'alerte simple ne s'applique pas directement.", id);
            }
            updatedReview.setNote(a.getNote());
            updatedReview.setCommentaire(a.getCommentaire());
            updatedReview.setDate(a.getDate());
            updatedReview.setProductId(a.getProductId());
            updatedReview.setUserId(a.getUserId());
            Avis savedUpdate = avisrepository.save(updatedReview);

            if (!productIdChanged && productId != null) {
                Double newAverageAfterUpdate = avisrepository.findAverageRatingByProductId(productId);
                log.debug("[UPDATE] Produit ID {}: Moyenne après mise à jour = {}", productId, newAverageAfterUpdate);
                checkAndSendAlert(productId, oldAverageBeforeUpdate, newAverageAfterUpdate);
            }

            return savedUpdate;
        } else {
            log.error("Tentative de mise à jour d'un avis inexistant. ID: {}", id);
            throw new RuntimeException("Review not found with id: " + id);
        }
    }

    private void checkAndSendAlert(Long productId, Double oldAverage, Double newAverage) {
        if (newAverage == null) {
            log.warn("checkAndSendAlert appelée avec newAverage null pour produit ID {}", productId);
            return;
        }

        boolean alertTriggered = false;
        if (newAverage < criticalThreshold) {
            log.info("Produit ID {}: Alerte potentielle (check) - Nouvelle moyenne ({}) < Seuil critique ({})", productId, String.format("%.2f", newAverage), criticalThreshold);
            alertTriggered = true;
        }
        if (oldAverage != null && (oldAverage - newAverage) >= significantDrop) {
            log.info("Produit ID {}: Alerte potentielle (check) - Baisse ({}) >= Baisse significative ({})", productId, String.format("%.2f", (oldAverage - newAverage)), significantDrop);
            alertTriggered = true;
        }

        if (alertTriggered) {
            // L'email du destinataire sera géré par EmailService
            log.warn("Déclenchement de l'alerte e-mail pour le produit ID {}", productId);
            // Appel à EmailService sans passer le destinataire
            emailService.sendAverageRatingDropAlert(productId, oldAverage, newAverage, criticalThreshold, significantDrop);
        }
    }


    @Override
    public List<Avis> getReviewsByNoteRange(int minNote, int maxNote) {
        if (minNote > maxNote) {
            throw new IllegalArgumentException("minNote cannot be greater than maxNote");
        }
        return avisrepository.findByNoteRange(minNote, maxNote);
    }

    @Override
    public Map<String, List<Avis>> categorizeReviewsByPositivity(int positivityThreshold) {
        List<Avis> allReviews = avisrepository.findAll();
        Map<Boolean, List<Avis>> partitionedReviews = allReviews.stream()
                .collect(Collectors.partitioningBy(avis -> avis.getNote() >= positivityThreshold));

        Map<String, List<Avis>> categorizedReviews = new HashMap<>();
        categorizedReviews.put("positive", partitionedReviews.get(true));
        categorizedReviews.put("negative", partitionedReviews.get(false));

        return categorizedReviews;
    }

    @Override
    public List<Avis> getReviewsWithHighestNote() {
        return avisrepository.findReviewsWithMaxNote();
    }

    @Override
    public List<Avis> getReviewsWithLowestNote() {
        return avisrepository.findReviewsWithMinNote();
    }
}