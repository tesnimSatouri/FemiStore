package tn.femistore.femistoreproduct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<CategorieEntite> getAllMainCategories(Pageable pageable) {
        return categoryRepository.findByParentIsNull(pageable);
    }

    public Page<CategorieEntite> getSubCategories(Long parentId, Pageable pageable) {
        Optional<CategorieEntite> parentCategoryOpt = categoryRepository.findById(parentId);
        if (!parentCategoryOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Parent category with ID " + parentId + " not found");
        }
        return categoryRepository.findByParentId(parentId, pageable);
    }

    public Page<CategorieEntite> searchCategories(String name, Pageable pageable) {
        return categoryRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    public Optional<CategorieEntite> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Fixed method name from 'save PentecostalsCategory' to 'saveCategory'
    public CategorieEntite saveCategory(CategorieEntite category) {
        return categoryRepository.save(category);
    }

    public CategorieEntite updateCategory(Long id, CategorieEntite updatedCategory) {
        CategorieEntite existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + id));
        existingCategory.setName(updatedCategory.getName());
        existingCategory.setDescription(updatedCategory.getDescription());
        existingCategory.setParent(updatedCategory.getParent());
        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}