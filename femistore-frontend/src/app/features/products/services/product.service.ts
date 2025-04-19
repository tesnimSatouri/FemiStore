import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.productServiceUrl}`; // Use productServiceUrl from environment

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/GetAllProducts`).pipe(
      catchError(this.handleError<Product[]>('getAllProducts', []))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/GetById/${id}`).pipe(
      catchError(this.handleError<Product>(`getProductById id=${id}`))
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/AddProduct`, product).pipe(
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/UpdateProduct/${id}`, product).pipe(
      catchError(this.handleError<Product>(`updateProduct id=${id}`))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/RemoveProduct/${id}`).pipe(
      catchError(this.handleError<void>(`deleteProduct id=${id}`))
    );
  }

  // Error handling method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error(error);
      return of(result as T);
    };
  }
}