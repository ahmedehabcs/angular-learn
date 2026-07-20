import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { ProductService } from '../../services/product-service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule, MatTooltipModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);

  protected readonly displayedColumns = [
    'product',
    'category',
    'price',
    'stock',
    'status',
    'actions',
  ];

  protected readonly products = signal<Product[]>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        const products = response.products.map<Product>((product) => ({
          ...product,
          status: Math.random() > 0.5 ? 'Active' : 'Inactive',
        }));

        this.products.set(products);
      },
      error: (err) => console.error(err),
    });
  }

  // Product summary
  protected readonly activeProducts = computed(() =>
    this.products().filter((pro) => pro.status === 'Active')
  );

  protected readonly lowStockProducts = computed(() =>
    this.products().filter((pro) => pro.stock <= 5 && pro.stock > 0)
  );

  protected readonly outOfStock = computed(() =>
    this.products().filter((pro) => pro.stock === 0)
  );

  // Search
  protected readonly searchTerm = signal('');

  protected searchBar(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  // Category filter
  protected readonly selectedCategory = signal('all');

  protected readonly categories = computed(() => [
    ...new Set(this.products().map((pro) => pro.category)),
  ]);

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  // Status filter
  protected readonly selectedStatus = signal('all');

  protected readonly status = computed(() => [
    ...new Set(this.products().map((pro) => pro.status)),
  ]);

  protected selectStatus(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
  }

  // Filtered products
  protected readonly productFilter = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const status = this.selectedStatus();

    return this.products().filter((product) => {
      const matchSearch =
        !search ||
        product.title.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search);

      const matchCategory =
        category === 'all' || product.category === category;

      const matchStatus = status === 'all' || product.status === status;

      return matchSearch && matchCategory && matchStatus;
    });
  });

  // Pagination
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(5);

  protected readonly paginationData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.productFilter().slice(start, start + this.pageSize());
  });

  protected readonly totalPage = computed(() =>
    Math.ceil(this.productFilter().length / this.pageSize())
  );

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

  // Delete
  protected deleteProduct(id: number): void {
    if (!window.confirm('Do you want to delete this item?')) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.products.update((products) =>
          products.filter((product) => product.id !== id)
        );
      },
      error: (err) => console.error(err),
    });
  }
}