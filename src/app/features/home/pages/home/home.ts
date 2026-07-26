import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../../admin/services/product-service';
import { Product } from '../../../admin/products/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly productService = inject(ProductService);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly totalProducts = signal(0);
  private readonly pageSize = 10;

  protected readonly hasMoreProducts = computed(
    () => this.products().length < this.totalProducts()
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  protected loadProducts(): void {
    const skip = this.products().length;

    if (skip > 0) {
      this.loadingMore.set(true);
    }

    this.errorMessage.set('');

    this.productService.getAllProducts(this.pageSize, skip).subscribe({
      next: (response) => {
        this.products.update((products) => [
          ...products,
          ...response.products,
        ]);
        this.totalProducts.set(response.total);
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load the products.');
        this.loading.set(false);
        this.loadingMore.set(false);
      },
    });
  }

  protected discountedPrice(product: Product): number {
    return product.price * (1 - product.discountPercentage / 100);
  }
}
