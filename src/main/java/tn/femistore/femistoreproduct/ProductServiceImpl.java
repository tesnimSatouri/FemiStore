package tn.femistore.femistoreproduct;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl  implements ProductService{
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        // Check if the product exists
        if (!productRepository.existsById(product.getId())) {
            return null; // Indicate that the product was not found
        }

        // Fetch the existing product
        Product existingProduct = productRepository.findById(product.getId()).orElse(null);
        if (existingProduct == null) {
            return null; // Shouldn't happen since existsById returned true, but added for safety
        }

        // Update the fields of the existing product
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setDiscountPercentage(product.getDiscountPercentage());

        // Save the updated product
        return productRepository.save(existingProduct);
    }
    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> searchProducts(String name, Double minPrice, Double maxPrice, Integer minStock, boolean useDiscountedPrice) {
        // Fetch all products matching the basic criteria
        List<Product> products = productRepository.searchProducts(name, minPrice, maxPrice, minStock);

        // If useDiscountedPrice is true, filter by discounted price instead of original price
        if (useDiscountedPrice && (minPrice != null || maxPrice != null)) {
            products = products.stream()
                    .filter(product -> {
                        Double discountedPrice = product.getDiscountedPrice();
                        boolean matchesMinPrice = minPrice == null || discountedPrice >= minPrice;
                        boolean matchesMaxPrice = maxPrice == null || discountedPrice <= maxPrice;
                        return matchesMinPrice && matchesMaxPrice;
                    })
                    .collect(Collectors.toList());
        }

        return products;
    }
}
