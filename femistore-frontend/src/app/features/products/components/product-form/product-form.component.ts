import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = { name: '', price: 0, stock: 0 };
  isEditMode = false;
  imageFile?: File;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productService.getProductById(+id).subscribe({
        next: (data) => this.product = data,
        error: (err) => console.error('Error fetching product:', err)
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  getImageUrl(imagePath: string): string {
    return `${environment.productServiceUrl}${imagePath}`; // e.g., http://localhost:8083/prd/product/images/filename
  }

  saveProduct(): void {
    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id!, this.product, this.imageFile).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error updating product:', err)
      });
    } else {
      this.productService.addProduct(this.product, this.imageFile).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error adding product:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}