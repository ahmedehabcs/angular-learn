import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Order, OrderResponse } from '../orders/models/orders.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cart`;

  getAllOrders(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/`);
  }

}
