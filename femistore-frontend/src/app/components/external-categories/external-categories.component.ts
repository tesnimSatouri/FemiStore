import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-external-categories',
  templateUrl: './external-categories.component.html',
  styleUrls: ['./external-categories.component.css']
})
export class ExternalCategoriesComponent implements OnInit {
  externalCategories: string[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getExternalCategories().subscribe({
      next: (categories) => this.externalCategories = categories,
      error: (err) => console.error('Error loading external categories:', err)
    });
  }
}