// src/app/products/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.productServiceUrl}`; // http://localhost:8081/prd/product

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    console.log('Fetching products from:', `${this.apiUrl}/GetAllProducts`);
    return this.http.get<Product[]>(`${this.apiUrl}/GetAllProducts`).pipe(
      catchError(this.handleError<Product[]>('getAllProducts', []))
    );
  }

  getAllProductsInCurrency(currency: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/GetAllProductsInCurrency`, { params: { currency } }).pipe(
      catchError(this.handleError<Product[]>('getAllProductsInCurrency', []))
    );
  }

  searchProducts(params: {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    useDiscountedPrice?: boolean;
  }): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params.name) httpParams = httpParams.set('name', params.name);
    if (params.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params.minStock !== undefined) httpParams = httpParams.set('minStock', params.minStock.toString());
    if (params.useDiscountedPrice !== undefined)
      httpParams = httpParams.set('useDiscountedPrice', params.useDiscountedPrice.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params: httpParams }).pipe(
      catchError(this.handleError<Product[]>('searchProducts', []))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/GetById/${id}`).pipe(
      catchError(this.handleError<Product>(`getProductById id=${id}`))
    );
  }

  addProduct(product: Product, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    const productToSend = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      discountPercentage: product.discountPercentage || 0,
      imageUrl: product.imageUrl || '',
    };
    formData.append('product', JSON.stringify(productToSend));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<Product>(`${this.apiUrl}/AddProduct`, formData).pipe(
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  updateProduct(id: number, product: Product, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    const productToSend = {
      id: id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      discountPercentage: product.discountPercentage || 0,
      imageUrl: product.imageUrl || '',
    };
    formData.append('product', JSON.stringify(productToSend));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.put<Product>(`${this.apiUrl}/UpdateProduct/${id}`, formData).pipe(
      catchError(this.handleError<Product>(`updateProduct id=${id}`))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/RemoveProduct/${id}`).pipe(
      catchError(this.handleError<void>(`deleteProduct id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}