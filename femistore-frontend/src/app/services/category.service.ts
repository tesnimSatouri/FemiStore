import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category } from '../models/category';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8488/api/categories';

  constructor(private http: HttpClient) {}

  getMainCategories(page: number, size: number, sort: string): Observable<Page<Category>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<Page<Category>>(this.apiUrl, { params });
  }

  getSubCategories(parentId: number, page: number, size: number, sort: string): Observable<Page<Category>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    // Updated URL to match the new backend endpoint
    return this.http.get<Page<Category>>(`${this.apiUrl}/${parentId}/subcategories`, { params });
  }

  getCategoryByName(name: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/name/${name}`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  searchCategories(name: string): Observable<Category[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Category[]>(`${this.apiUrl}/search`, { params });
  }

  getExternalCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/external`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllMainCategories(): Observable<Category[]> {
    return this.http.get<Page<Category>>(this.apiUrl, { params: new HttpParams().set('page', '0').set('size', '100') })
      .pipe(
        map(page => page.content)
      );
  }
}