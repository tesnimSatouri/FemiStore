package tn.femistore.femistoreproduct;

import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Product product);
    void deleteProduct(Long id);
    // New advanced search method
    // Updated search method to include useDiscountedPrice
    List<Product> searchProducts(String name, Double minPrice, Double maxPrice, Integer minStock, boolean useDiscountedPrice);
}
