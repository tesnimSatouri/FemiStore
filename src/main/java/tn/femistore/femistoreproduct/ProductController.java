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
@RestController
public class ProductController {
    private final ProductService productService;
    //private static final String IMAGE_DIRECTORY = "C:/Users/chaym/Downloads/";

    public ProductController(ProductService productService) {
        this.productService = productService;
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



    @PutMapping("/UpdateProduct")
    public Product updateProduct(@RequestBody Product product) {
        return productService.updateProduct(product);
    }

    @DeleteMapping("/RemoveProduct/{id}")
    public void removeProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
    }

}
