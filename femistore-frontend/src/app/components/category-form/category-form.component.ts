import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  categoryId: number | null = null;
  parentId: number | null = null;
  mainCategories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      parentId: [null] // Add parentId field
    });
  }

  ngOnInit(): void {
    // Fetch main categories for the dropdown
    this.categoryService.getAllMainCategories().subscribe({
      next: (categories: Category[]) => {
        this.mainCategories = categories;
      },
      error: (err: any) => console.error('Error loading main categories:', err)
    });

    // Check if we're editing a category or adding a subcategory
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const parentId = params.get('parentId');

      if (id) {
        // Editing an existing category
        this.categoryId = +id;
        this.categoryService.getCategoryById(this.categoryId).subscribe({
          next: (category: Category) => { // Explicitly type 'category'
            this.categoryForm.patchValue({
              name: category.name,
              description: category.description,
              parentId: category.parent ? category.parent.id : null
            });
          },
          error: (err: any) => console.error('Error loading category:', err) // Explicitly type 'err'
        });
      } else if (parentId) {
        // Adding a subcategory with a preselected parent
        this.parentId = +parentId;
        this.categoryForm.patchValue({ parentId: this.parentId });
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const formValue = this.categoryForm.value;
    const category: Category = {
      name: formValue.name,
      description: formValue.description,
      parent: formValue.parentId ? { id: formValue.parentId } as Category : undefined
    };

    if (this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, category).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: any) => console.error('Error updating category:', err)
      });
    } else {
      this.categoryService.addCategory(category).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: any) => console.error('Error adding category:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['']);
  }
}