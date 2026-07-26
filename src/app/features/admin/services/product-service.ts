import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category, Product, ProductResponse } from '../products/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  getAllProducts(limit?: number, skip?: number): Observable<ProductResponse> {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit);
    }

    if (skip !== undefined) {
      params = params.set('skip', skip);
    }

    return this.http.get<ProductResponse>(this.baseUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  add(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/add`, product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
