package tn.femistore.femistoreproduct;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategorieEntite, Long> {
    Page<CategorieEntite> findByParentIsNull(Pageable pageable);
    @Query("SELECT c FROM CategorieEntite c WHERE c.parent.id = :parentId")
    Page<CategorieEntite> findByParentId(@Param("parentId") Long parentId, Pageable pageable);
    Page<CategorieEntite> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Optional<CategorieEntite> findByName(String name);
}