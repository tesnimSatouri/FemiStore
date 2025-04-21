// src/app/products/components/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { StockDetails } from '../../models/stock.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  loading = false;
  error = '';
  userRole: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('user');

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details';
        console.error(err);
        this.loading = false;
      },
    });
  }

  getImageUrl(imagePath?: string): string {
    return imagePath ? `${environment.productServiceUrl}/images/${imagePath}` : 'assets/no-image.png';
  }

  editProduct(): void {
    if (this.product?.id) {
      this.router.navigate(['/products/edit', this.product.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}