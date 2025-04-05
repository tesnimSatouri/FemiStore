package tn.femistore.femistoreproduct;

import org.springframework.stereotype.Service;

import java.util.List;
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

        // Fetch the existing productt
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

        // Save the updated product
        return productRepository.save(existingProduct);
    }
    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

}
