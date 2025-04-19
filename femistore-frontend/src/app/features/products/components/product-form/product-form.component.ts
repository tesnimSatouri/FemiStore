import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = { name: '', price: 0, stock: 0 };
  isEditMode = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router // Router is already injected here
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

  saveProduct(): void {
    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id!, this.product).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error updating product:', err)
      });
    } else {
      this.productService.addProduct(this.product).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error adding product:', err)
      });
    }
  }

  // Add the cancel method to handle navigation
  cancel(): void {
    this.router.navigate(['/products']);
  }
}