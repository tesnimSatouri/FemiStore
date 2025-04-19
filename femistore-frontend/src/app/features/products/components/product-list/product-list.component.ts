import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchParams = {
    name: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    minStock: null as number | null,
    useDiscountedPrice: false
  };
  selectedCurrency = 'TND';
  currencies = ['TND', 'USD', 'EUR']; // Add more currencies as supported by backend

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.searchParams.name || this.searchParams.minPrice || this.searchParams.maxPrice || this.searchParams.minStock || this.searchParams.useDiscountedPrice) {
      this.searchProducts();
    } else {
      this.productService.getAllProductsInCurrency(this.selectedCurrency).subscribe({
        next: (data) => {
          console.log('Products received:', data);
          this.products = data;
        },
        error: (err) => console.error('Error fetching products:', err)
      });
    }
  }

  searchProducts(): void {
    this.productService.searchProducts({
      name: this.searchParams.name || undefined,
      minPrice: this.searchParams.minPrice ?? undefined,
      maxPrice: this.searchParams.maxPrice ?? undefined,
      minStock: this.searchParams.minStock ?? undefined,
      useDiscountedPrice: this.searchParams.useDiscountedPrice
    }).subscribe({
      next: (data) => {
        console.log('Search results:', data);
        this.products = data;
      },
      error: (err) => console.error('Error searching products:', err)
    });
  }

  onCurrencyChange(): void {
    this.loadProducts();
  }

  clearSearch(): void {
    this.searchParams = {
      name: '',
      minPrice: null,
      maxPrice: null,
      minStock: null,
      useDiscountedPrice: false
    };
    this.loadProducts();
  }

  getImageUrl(imagePath: string): string {
    return `${environment.productServiceUrl}${imagePath}`;
  }

  editProduct(id?: number): void {
    if (id) {
      this.router.navigate(['/products/edit', id]);
    }
  }

  deleteProduct(id?: number): void {
    if (id && confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/products/add']);
  }
}