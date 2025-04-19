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

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Products received:', data);
        this.products = data;
      },
      error: (err) => console.error('Error fetching products in component:', err)
    });
  }

  getImageUrl(imagePath: string): string {
    return `${environment.productServiceUrl}${imagePath}`; // e.g., http://localhost:8083/prd/product/images/filename
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