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

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
    @Autowired
    private EmailService emailService;
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ExternalCategoryService externalCategoryService;

    @GetMapping
    public Page<CategorieEntite> getAllMainCategories(@PageableDefault(size = 10, sort = "name") Pageable pageable) {
        logger.info("Fetching main categories with pageable: {}", pageable);
        return categoryService.getAllMainCategories(pageable);
    }

    @GetMapping("/{parentId}/subcategories")
    public Page<CategorieEntite> getSubCategories(@PathVariable Long parentId, @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        logger.info("Fetching subcategories for parentId: {} with pageable: {}", parentId, pageable);
        return categoryService.getSubCategories(parentId, pageable);
    }

    @GetMapping("/name/{name}")
    public Optional<CategorieEntite> getCategoryByName(@PathVariable String name) {
        logger.info("Fetching category by name: {}", name);
        return categoryService.getCategoryByName(name);
    }

    @GetMapping("/{id}")
    public Optional<CategorieEntite> getCategoryById(@PathVariable Long id) {
        logger.info("Fetching category by id: {}", id);
        return categoryService.getCategoryById(id);
    }

    @GetMapping("/search")
    public List<CategorieEntite> searchCategories(@RequestParam String name) {
        logger.info("Searching categories with name: {}", name);
        return categoryService.searchCategories(name);
    }

  /*  @GetMapping("/external")
    public ResponseEntity<List<String>> getExternalCategories() {
        logger.info("Fetching external categories");
        List<String> categories = externalCategoryService.fetchExternalCategories();
        if (categories.isEmpty()) {
            logger.warn("No external categories found");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(categories);
    }*/

    @PostMapping
    public ResponseEntity<CategorieEntite> addCategory(@Valid @RequestBody CategorieEntite category) {
        logger.info("Adding new category: {} with parent ID: {}",
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : "none");

        try {
            // Sauvegarde de la catégorie
            CategorieEntite savedCategory = categoryService.saveCategory(category);

            // Envoi de la notification par email
            boolean isSubcategory = category.getParent() != null;
            Long parentId = isSubcategory ? category.getParent().getId() : null;
            emailService.sendCategoryAddedNotification(category.getName(), isSubcategory, parentId);

            // Retourner une réponse HTTP avec la catégorie ajoutée
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            logger.error("Error while adding category: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }


    @PutMapping("/{id}")
    public CategorieEntite updateCategory(@PathVariable Long id, @Valid @RequestBody CategorieEntite category) {
        logger.info("Updating category with id: {}", id);
        return categoryService.updateCategory(id, category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        logger.info("Deleting category with id: {}", id);
        categoryService.deleteCategory(id);
    }
}