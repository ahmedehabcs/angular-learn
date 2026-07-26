import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  getOrderStatus,
  getPaymentStatus,
  Order,
  OrderResponse,
  OrderStatus,
  PaymentStatus,
} from '../../models/orders.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatTableModule, MatChipsModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit {
  private readonly orderService = inject(OrderService);

  protected readonly displayedColumns = [
    'order',
    'customer',
    'date',
    'items',
    'total',
    'payment',
    'status',
    'actions',
  ];

  protected readonly orders = signal<Order[]>([]);

  protected readonly statuses = signal<OrderStatus[]>([
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ]);

  protected readonly paymentStatuses = signal<PaymentStatus[]>([
    'Paid',
    'Pending',
    'Refunded',
  ]);

  protected readonly selectedStatus =
    signal<OrderStatus | 'all'>('all');

  protected readonly selectedPayment =
    signal<PaymentStatus | 'all'>('all');

  protected readonly searchTerm = signal('');

  protected readonly pageSize = 10;

  protected readonly currentPage = signal(1);

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: OrderResponse) => {
        const orders = response.carts.map<Order>((order) => ({
          ...order,
          status: getOrderStatus(order.id),
          paymentStatus: getPaymentStatus(order.id),
        }));

        this.orders.set(orders);
      },

      error: (err) => console.error(err),
    });
  }

  protected readonly pendingOrders = computed(() =>
    this.orders().filter((o) => o.status === 'Pending')
  );

  protected readonly completedOrders = computed(() =>
    this.orders().filter((o) => o.status === 'Delivered')
  );

  protected readonly totalRevenue = computed(() =>
    this.orders().reduce((sum, order) => sum + order.total, 0)
  );

  protected readonly filteredOrders = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const payment = this.selectedPayment();

    return this.orders().filter((order) => {
      const matchSearch =
        !search ||
        order.id.toString().includes(search) ||
        order.userId.toString().includes(search);

      const matchStatus =
        status === 'all' || order.status === status;

      const matchPayment =
        payment === 'all' || order.paymentStatus === payment;

      return matchSearch && matchStatus && matchPayment;
    });
  });

  protected readonly totalPage = computed(() =>
    Math.max(
      1,
      Math.ceil(this.filteredOrders().length / this.pageSize)
    )
  );

  protected readonly paginationData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;

    return this.filteredOrders().slice(
      start,
      start + this.pageSize
    );
  });

  protected nextPage(): void {
    if (this.currentPage() < this.totalPage()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  protected searchBar(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  protected selectStatus(status: OrderStatus | 'all'): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
  }

  protected selectPayment(payment: PaymentStatus | 'all'): void {
    this.selectedPayment.set(payment);
    this.currentPage.set(1);
  }

  protected deleteOrder(id: number): void {
    this.orders.update((orders) =>
      orders.filter((order) => order.id !== id)
    );
  }

  protected refreshOrders(): void {
    this.loadOrders();
  }
}
