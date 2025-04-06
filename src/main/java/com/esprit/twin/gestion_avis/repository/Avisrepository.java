package com.esprit.twin.gestion_avis.repository;

import com.esprit.twin.gestion_avis.entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Avisrepository extends JpaRepository<Avis, Long> {
    @Query("SELECT AVG(r.note) FROM Avis r WHERE r.productId = ?1")
    Double findAverageRatingByProductId(Long productId);
    @Query("SELECT a FROM Avis a WHERE a.note >= :minNote AND a.note <= :maxNote")
    List<Avis> findByNoteRange(@Param("minNote") int minNote, @Param("maxNote") int maxNote);

    // New Query: Find reviews with the highest note
    @Query("SELECT a FROM Avis a WHERE a.note = (SELECT MAX(a2.note) FROM Avis a2)")
    List<Avis> findReviewsWithMaxNote();

    // New Query: Find reviews with the lowest note
    @Query("SELECT a FROM Avis a WHERE a.note = (SELECT MIN(a2.note) FROM Avis a2)")
    List<Avis> findReviewsWithMinNote();

}
