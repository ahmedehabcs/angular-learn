import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import {
  getOrderStatus,
  getPaymentStatus,
  Order,
} from '../../models/orders.model';

@Component({
  selector: 'app-order-details',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');

  protected readonly displayedColumns = [
    'product',
    'price',
    'quantity',
    'discount',
    'total',
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.loading.set(false);
      this.errorMessage.set('Invalid order ID.');
      return;
    }

    this.loadOrder(id);
  }

  private loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order.set({
          ...order,
          status: getOrderStatus(order.id),
          paymentStatus: getPaymentStatus(order.id),
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('The order could not be found.');
        this.loading.set(false);
      },
    });
  }
}
