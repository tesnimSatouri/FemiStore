import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Page } from '../../models/page';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  sort = 'name,asc';
  parentId: number | null = null;
  errorMessage: string | null = null;
  searchTerm = '';
  displayedColumns = ['name', 'description', 'actions'];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.parentId = params.get('parentId') ? +params.get('parentId')! : null;
      this.loadCategories();
    });

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loadCategories());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.errorMessage = null;

    const request = this.searchTerm.trim()
      ? this.categoryService.searchCategories(this.searchTerm, this.currentPage, this.pageSize, this.sort)
      : this.parentId
        ? this.categoryService.getSubCategories(this.parentId, this.currentPage, this.pageSize, this.sort)
        : this.categoryService.getMainCategories(this.currentPage, this.pageSize, this.sort);

    request.subscribe({
      next: (pageData: Page<Category>) => {
        this.categories = pageData.content;
        this.totalElements = pageData.totalElements;
      },
      error: (err: HttpErrorResponse) => this.handleError(err)
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  onSearch(): void {
    this.currentPage = 0; // Reset to first page on new search
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadCategories();
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err: HttpErrorResponse) => console.error('Error deleting category:', err)
      });
    }
  }

  private handleError(err: HttpErrorResponse): void {
    console.error('Error:', err);
    if (err.status === 404 && this.parentId) {
      this.errorMessage = 'Parent category not found. Redirecting to main categories...';
      setTimeout(() => this.router.navigate(['/']), 2000);
    } else {
      this.errorMessage = `An error occurred: ${err.message}`;
    }
  }
}