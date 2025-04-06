package tn.femistore.femistoreproduct;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Optional;

import java.io.IOException;
import java.nio.file.*;
import java.util.stream.Collectors;

@RequestMapping("/product")
@RestController
public class ProductController {
    private final ProductService productService;
    private final ExchangeRateService exchangeRateService;
    //private static final String IMAGE_DIRECTORY = "C:/Users/chaym/Downloads/";

    public ProductController(ProductService productService, ExchangeRateService exchangeRateService) {
        this.productService = productService;
        this.exchangeRateService = exchangeRateService;
    }
   /* @ApiOperation(value = "Upload an image file")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "file", value = "Image file to upload", required = true, dataType = "file", paramType = "form")
    })
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(IMAGE_DIRECTORY + fileName);
            Files.write(filePath, file.getBytes());

            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }
*/

    @GetMapping("/GetAllProducts")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/GetById/{id}")
    public Optional<Product> getProductById(@PathVariable("id") Long id) {
        return Optional.ofNullable(productService.getProductById(id));
    }
    @PostMapping("/AddProduct")
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }



    @PutMapping("/UpdateProduct/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") Long id, @Valid @RequestBody Product product) {
        System.out.println("Updating product with id: " + id);
        System.out.println("Received product: " + product);
        product.setId(id);
        Product updatedProduct = productService.updateProduct(product);
        if (updatedProduct == null) {
            System.out.println("Product with id : " + id + " not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        System.out.println("Updated product: " + updatedProduct);
        return ResponseEntity.ok(updatedProduct);
    }


    @DeleteMapping("/RemoveProduct/{id}")
    public void removeProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
    }

    // Updated search endpoint to optionally filter by discounted price
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "minStock", required = false) Integer minStock,
            @RequestParam(value = "useDiscountedPrice", defaultValue = "false") boolean useDiscountedPrice) {
        List<Product> products = productService.searchProducts(name, minPrice, maxPrice, minStock, useDiscountedPrice);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/GetAllProductsInCurrency")
    public ResponseEntity<List<Product>> getAllProductsInCurrency(@RequestParam("currency") String currency) {
        try {
            Double exchangeRate = exchangeRateService.getExchangeRate(currency);
            List<Product> products = productService.getAllProducts();
            List<Product> convertedProducts = products.stream()
                    .map(product -> {
                        Product p = new Product();
                        p.setId(product.getId());
                        p.setName(product.getName());
                        p.setDescription(product.getDescription());
                        // Convert price to target currency
                        p.setPrice(product.getPrice() * exchangeRate);
                        p.setDiscountPercentage(product.getDiscountPercentage());
                        // Apply discount after currency conversion
                        if (p.getDiscountPercentage() != null && p.getDiscountPercentage() > 0) {
                            p.setPrice(p.getPrice() * (1 - p.getDiscountPercentage() / 100));
                        }
                        p.setStock(product.getStock());
                        p.setImageUrl(product.getImageUrl());
                        return p;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(convertedProducts);
        } catch (RuntimeException e) {
            System.err.println("Error in GetAllProductsInCurrency: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
