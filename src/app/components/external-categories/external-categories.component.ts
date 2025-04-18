import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-external-categories',
  templateUrl: './external-categories.component.html',
  styleUrls: ['./external-categories.component.css']
})
export class ExternalCategoriesComponent implements OnInit {
  externalCategories: string[] = [];
  errorMessage: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    

  }
}