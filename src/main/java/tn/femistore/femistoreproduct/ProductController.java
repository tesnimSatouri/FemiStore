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
    // Define the directory where images will be stored
    private static final String IMAGE_DIRECTORY = "C:/SpringEsprit/FemiStore/femistore-backend/images/";

    public ProductController(ProductService productService, ExchangeRateService exchangeRateService) {
        this.productService = productService;
        this.exchangeRateService = exchangeRateService;
        // Create the images directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(IMAGE_DIRECTORY));
        } catch (IOException e) {
            System.err.println("Failed to create image directory: " + e.getMessage());
        }
    }

    @ApiOperation(value = "Upload an image file")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "file", value = "Image file to upload", required = true, dataType = "file", paramType = "form")
    })
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload a file");
            }
            // Ensure the file is an image
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload an image file");
            }

            // Generate a unique file name
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(IMAGE_DIRECTORY + fileName);
            Files.write(filePath, file.getBytes());

            // Return the file path (relative to the server)
            String fileUrl = "/images/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed: " + e.getMessage());
        }
    }

    // Serve images statically
    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(IMAGE_DIRECTORY + fileName);
            byte[] imageBytes = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg") // Adjust based on your image type
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Existing endpoints with modifications to handle image
    @GetMapping("/GetAllProducts")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/GetById/{id}")
    public Optional<Product> getProductById(@PathVariable("id") Long id) {
        return Optional.ofNullable(productService.getProductById(id));
    }

    @PostMapping(value = "/AddProduct", consumes = {"multipart/form-data"})
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") String productString,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            // Parse product JSON string
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productString, Product.class);

            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(IMAGE_DIRECTORY + fileName);
                Files.write(filePath, image.getBytes());
                product.setImageUrl("/images/" + fileName);
            }

            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "/UpdateProduct/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Product> updateProduct(
            @PathVariable("id") Long id,
            @RequestPart("product") String productString,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            // Parse product JSON string
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productString, Product.class);
            product.setId(id);

            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(IMAGE_DIRECTORY + fileName);
                Files.write(filePath, image.getBytes());
                product.setImageUrl("/images/" + fileName);
            }

            Product updatedProduct = productService.updateProduct(product);
            if (updatedProduct == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(updatedProduct);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
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
                        p.setPrice(product.getPrice() * exchangeRate);
                        p.setDiscountPercentage(product.getDiscountPercentage());
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