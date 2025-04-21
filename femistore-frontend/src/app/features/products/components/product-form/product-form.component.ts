import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { StockService } from '../../../inventory/services/stock.service';
import { Product } from '../../models/product.model';
import { Supplier } from '../../../inventory/models/stock.model';
import { environment } from '../../../../../environments/environment';
import { CategoryService } from '../../../category/services/category.service';
import { Category } from '../../../category/models/category';
import { Page } from '../../../category/models/page';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  imageFile?: File;
  error = '';
  loading = false;
  submitted = false;
  suppliers: Supplier[] = [];
  mainCategories: Category[] = [];
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,

  ) {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      discountPercentage: [null, [Validators.min(0), Validators.max(100)]],
      imageUrl: [''],
      stockDisponible: ['', [Validators.required, Validators.min(0)]],
      stock_minimum: ['', [Validators.required, Validators.min(0)]],
      fournisseur_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getMainCategories(0, 100, 'name,asc').subscribe({
      next: (pageData: Page<Category>) => {
        this.mainCategories = pageData.content; // Extract categories from the Page object
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading main categories:', err);
        this.errorMessage = 'Error loading main categories. Please try again.';
      }
    });
    this.loadSuppliers();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productForm.get('stockDisponible')?.disable();
      this.productForm.get('stock_minimum')?.disable();
      this.productForm.get('fournisseur_id')?.disable();
      this.productService.getProductById(+id).subscribe({
        next: (data) => {
          this.productForm.patchValue({
            id: data.id,
            name: data.name,
            description: data.description || '',
            price: data.price,
            stock: data.stock,
            discountPercentage: data.discountPercentage || null,
            imageUrl: data.imageUrl || '',
          });
        },
        error: (err) => {
          this.error = 'Error fetching product';
          console.error(err);
        },
      });
    }
  }

  loadSuppliers(): void {
    this.stockService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (err) => {
        console.error('Failed to load suppliers', err);
        this.error = 'Failed to load suppliers';
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  getImageUrl(imagePath: string): string {
    const fileName = imagePath.replace(/^\/images\//, '');
    return `${environment.productServiceUrl}/images/${fileName}`;
  }

  saveProduct(): void {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const productData: Product = {
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value || undefined,
      price: this.productForm.get('price')?.value,
      stock: this.productForm.get('stock')?.value,
      discountPercentage: this.productForm.get('discountPercentage')?.value || undefined,
      imageUrl: this.productForm.get('imageUrl')?.value || undefined,
    };

    if (this.isEditMode && this.productForm.get('id')?.value) {
      productData.id = this.productForm.get('id')?.value;
      if (productData.id !== undefined) {
        this.productService.updateProduct(productData.id, productData, this.imageFile).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/products']);
          },
          error: (err) => {
            this.error = 'Error updating product';
            console.error(err);
            this.loading = false;
          },
        });
      } else {
        this.error = 'Product ID is undefined';
        this.loading = false;
      }
    } else {
      this.productService.addProduct(productData, this.imageFile).subscribe({
          next: (newProduct) => {
          if (newProduct.id === undefined) {
            this.error = 'New product ID is undefined';
            this.loading = false;
            return;
          }
          const stockData = {
            productId: newProduct.id,
            stockDisponible: this.productForm.get('stockDisponible')?.value,
            stock_minimum: this.productForm.get('stock_minimum')?.value,
            fournisseur_id: this.productForm.get('fournisseur_id')?.value,
          };
          this.stockService.addStock(stockData).subscribe({
            next: () => {
              this.loading = false;
              this.router.navigate(['/products']);
            },
            error: (err) => {
              this.error = 'Error adding stock';
              console.error(err);
              this.loading = false;
            },
          });
        },
        error: (err) => {
          this.error = 'Error adding product';
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  get f() {
    return this.productForm.controls;
  }
}
