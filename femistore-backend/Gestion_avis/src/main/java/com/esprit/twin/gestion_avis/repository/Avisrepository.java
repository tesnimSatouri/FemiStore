package com.esprit.twin.gestion_avis.repository;

import com.esprit.twin.gestion_avis.entity.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface Avisrepository extends JpaRepository<Avis, Long> {
    @Query("SELECT AVG(r.note) FROM Avis r WHERE r.productId = ?1")
    Double findAverageRatingByProductId(Long productId);
}
