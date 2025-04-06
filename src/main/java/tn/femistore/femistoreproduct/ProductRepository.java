package tn.femistore.femistoreproduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Override
    List<Product> findAllById(Iterable<Long> longs);

    // Search by name (case-insensitive partial match)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Search by price range
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    // Search by stock availability
    List<Product> findByStockGreaterThanEqual(Integer minStock);

    // Combined search with optional parameters
    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (:minStock IS NULL OR p.stock >= :minStock)")
    List<Product> searchProducts(String name, Double minPrice, Double maxPrice, Integer minStock);
}
