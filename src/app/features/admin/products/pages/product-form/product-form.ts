import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { Category, Product } from '../../models/product.model';
import { form, FormRoot, FormField, submit } from '@angular/forms/signals';
import { productFormValidation } from './product-form.validation';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-form',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, RouterLink, FormRoot, FormField],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})

export class ProductForm implements OnInit {
  private readonly ProductService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly product = signal<Product>({
    id: 0,
    title: '',
    description: '',
    brand: '',
    price: 0,
    discountPercentage: 0,
    stock: 0,
    category: '',
    status: 'Active',
    availabilityStatus: 'In Stock',
    sku: '',
    rating: 0,
    thumbnail: '',
    images: []
  });
  protected readonly categories = signal<Category[]>([]);
  protected readonly statuses: Product['status'][] = [
    'Active',
    'Inactive',
  ];
  protected readonly availabilityStatuses: Product['availabilityStatus'][] = [
    'In Stock',
    'Low Stock',
    'Out of Stock',
  ];
  private readonly isEditMode = signal(false);
  protected readonly imagesText = computed(() => this.product().images.join('\n'));

  ngOnInit(): void {
    this.ProductService.getCategory().subscribe({
      next: (res) => this.categories.set(res)
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.isEditMode.set(true);
    this.ProductService.getProductById(id).subscribe(
      {
        next: (res) => {
          const status = Math.random() > 0.5 ? 'Active' : 'Inactive';
          this.product.set({ ...res, status });
        },
        error: (res) => console.log(res)
      }
    )
  }

  protected readonly productForm = form(
    this.product,
    productFormValidation,
    {
      submission: {
        action: async (field) => {
          const data = field().value();

          if (this.isEditMode()) {
            await this.updateProduct(data);
          } else {
            await this.addProduct(data);
          }
        }
      }
    }
  );

  private async addProduct(data: Product): Promise<void> {
    try {
      this.router.navigate(['admin/products']);
      const response = await firstValueFrom(this.ProductService.add(data));
      console.log('Product added:', response);
    } catch (error) {
      console.error('Add product failed:', error);
    }
  }


  private async updateProduct(data: Product): Promise<void> {
    try {
      console.log('Updated Product: ', data);
      const response = await firstValueFrom(this.ProductService.update(data.id, data));
      this.router.navigate(['/admin/products']);
      console.log('Product updated:', response);
    } catch (error) {
      console.error('Update product failed:', error);
    }
  }

  protected submitProductForm(event: Event): void {
    event.preventDefault();
    void submit(this.productForm);
  }

  protected updateImages(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    const images = value
      .split(/\r?\n|,/)
      .map((image) => image.trim())
      .filter(Boolean);

    this.productForm.images().value.set(images);
  }
}