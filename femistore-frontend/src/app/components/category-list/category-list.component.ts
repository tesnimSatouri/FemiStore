import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Page } from '../../models/page';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  sort = 'name,asc';
  parentId: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const parentId = params.get('parentId');
      this.parentId = parentId ? +parentId : null;
      this.loadCategories(this.currentPage);
    });
  }

  loadCategories(page: number): void {
    this.currentPage = page;
    this.errorMessage = null; // Reset error message
    if (this.parentId) {
      this.categoryService.getSubCategories(this.parentId, page, this.pageSize, this.sort).subscribe({
        next: (pageData: Page<Category>) => this.handlePageData(pageData),
        error: (err: HttpErrorResponse) => {
          console.error('Error loading subcategories:', err);
          if (err.status === 404) {
            this.errorMessage = 'Parent category not found. Redirecting to main categories...';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          } else {
            this.errorMessage = 'An error occurred while loading subcategories. Please try again later.';
          }
        }
      });
    } else {
      this.categoryService.getMainCategories(page, this.pageSize, this.sort).subscribe({
        next: (pageData: Page<Category>) => this.handlePageData(pageData),
        error: (err: HttpErrorResponse) => {
          console.error('Error loading main categories:', err);
          this.errorMessage = 'An error occurred while loading main categories. Please try again later.';
        }
      });
    }
  }

  handlePageData(pageData: Page<Category>): void {
    this.categories = pageData.content;
    this.totalElements = pageData.totalElements;
    this.totalPages = pageData.totalPages;
  }

  onPageChange(page: number): void {
    this.loadCategories(page);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(this.currentPage),
        error: (err: HttpErrorResponse) => console.error('Error deleting category:', err)
      });
    }
  }
}