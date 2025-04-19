import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.productServiceUrl}`; // http://localhost:8083/prd/product

  constructor(private http: HttpClient) { }

  // Upload image and return the URL
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/uploadImage`, formData).pipe(
      catchError(this.handleError<string>('uploadImage', ''))
    );
  }

  getAllProducts(): Observable<Product[]> {
    console.log('Fetching products from:', `${this.apiUrl}/GetAllProducts`);
    return this.http.get<Product[]>(`${this.apiUrl}/GetAllProducts`).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return this.handleError<Product[]>('getAllProducts', [])(error);
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/GetById/${id}`).pipe(
      catchError(this.handleError<Product>(`getProductById id=${id}`))
    );
  }

  addProduct(product: Product, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<Product>(`${this.apiUrl}/AddProduct`, formData).pipe(
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  updateProduct(id: number, product: Product, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    // Ensure all required fields are included in the product object
    const productToSend = {
        id: id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        discountPercentage: product.discountPercentage || 0,
        imageUrl: product.imageUrl || '' // Include current imageUrl to avoid overwriting
    };
    formData.append('product', JSON.stringify(productToSend));
    if (imageFile) {
        formData.append('image', imageFile);
    }
    console.log('Updating product with FormData:', formData); // Debug
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
      console.error(error);
      return of(result as T);
    };
  }
}