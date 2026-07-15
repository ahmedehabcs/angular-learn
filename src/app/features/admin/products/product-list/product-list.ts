import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-list',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  protected readonly displayedColumns = [
    'product',
    'category',
    'price',
    'stock',
    'status',
    'actions',
  ];

  protected readonly products = [
    {
      name: 'Wireless Headphones',
      sku: 'WH-1001',
      category: 'Electronics',
      price: 'EGP 2,499',
      stock: 18,
      stockText: 'In stock',
      status: 'Active',
    },
    {
      name: 'Mechanical Keyboard',
      sku: 'MK-2045',
      category: 'Electronics',
      price: 'EGP 1,899',
      stock: 4,
      stockText: 'Low stock',
      status: 'Active',
    },
    {
      name: 'Classic T-Shirt',
      sku: 'TS-3012',
      category: 'Clothing',
      price: 'EGP 499',
      stock: 32,
      stockText: 'In stock',
      status: 'Active',
    },
    {
      name: 'Running Shoes',
      sku: 'RS-4080',
      category: 'Shoes',
      price: 'EGP 1,599',
      stock: 0,
      stockText: 'Out of stock',
      status: 'Inactive',
    },
  ];
}