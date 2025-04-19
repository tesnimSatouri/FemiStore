import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../models/page';

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
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      parentId: [null]
    });
  }

  ngOnInit(): void {
    // Fetch main categories with pagination (e.g., first page with a large size)
    this.categoryService.getMainCategories(0, 100, 'name,asc').subscribe({
      next: (pageData: Page<Category>) => {
        this.mainCategories = pageData.content; // Extract categories from the Page object
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading main categories:', err);
        this.errorMessage = 'Error loading main categories. Please try again.';
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const parentId = params.get('parentId');

      if (id) {
        this.categoryId = +id;
        this.categoryService.getCategoryById(this.categoryId).subscribe({
          next: (category: Category) => {
            this.categoryForm.patchValue({
              name: category.name,
              description: category.description,
              parentId: category.parent ? category.parent.id : null
            });
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error loading category:', err);
            this.errorMessage = 'Error loading category. Please try again.';
          }
        });
      } else if (parentId) {
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
      id: this.categoryId || undefined, // Include id for updates
      name: formValue.name,
      description: formValue.description,
      parent: formValue.parentId ? { id: formValue.parentId } as Category : undefined
    };

    if (this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, category).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: HttpErrorResponse) => {
          console.error('Error updating category:', err);
          this.errorMessage = 'Error updating category. Please try again.';
        }
      });
    } else {
      this.categoryService.addCategory(category).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: HttpErrorResponse) => {
          console.error('Error adding category:', err);
          this.errorMessage = 'Error adding category. Please try again.';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}