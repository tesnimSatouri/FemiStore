package tn.femistore.femistoreproduct;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public ResponseEntity<Page<CategorieEntite>> getAllMainCategories(
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        logger.info("Fetching main categories with pageable: {}", pageable);
        Page<CategorieEntite> categories = categoryService.getAllMainCategories(pageable);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{parentId}/subcategories")
    public ResponseEntity<Page<CategorieEntite>> getSubCategories(
            @PathVariable Long parentId,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        logger.info("Fetching subcategories for parentId: {} with pageable: {}", parentId, pageable);
        Page<CategorieEntite> subCategories = categoryService.getSubCategories(parentId, pageable);
        return ResponseEntity.ok(subCategories);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CategorieEntite>> searchCategories(
            @RequestParam String name,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        logger.info("Searching categories with name: {} and pageable: {}", name, pageable);
        Page<CategorieEntite> categories = categoryService.searchCategories(name, pageable);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategorieEntite> getCategoryById(@PathVariable Long id) {
        logger.info("Fetching category by id: {}", id);
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategorieEntite> addCategory(@Valid @RequestBody CategorieEntite category) {
        logger.info("Adding new category: {} with parent ID: {}",
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : "none");
        try {
            CategorieEntite savedCategory = categoryService.saveCategory(category);
            boolean isSubcategory = category.getParent() != null;
            Long parentId = isSubcategory ? category.getParent().getId() : null;
            emailService.sendCategoryAddedNotification(category.getName(), isSubcategory, parentId);
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            logger.error("Error while adding category: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategorieEntite> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategorieEntite category) {
        logger.info("Updating category with id: {}", id);
        try {
            CategorieEntite updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            logger.error("Error updating category: ", e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        logger.info("Deleting category with id: {}", id);
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}