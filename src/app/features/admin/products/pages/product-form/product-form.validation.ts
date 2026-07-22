import { min, minLength, required } from '@angular/forms/signals';

export const productFormValidation = (path: any) => {
    required(path.title, { message: 'Title is required' });
    minLength(path.title, 3, { message: 'Title must be at least 3 characters' });

    required(path.description, { message: 'Description is required' });
    minLength(path.description, 10, { message: 'Description must be at least 10 characters' });

    required(path.price, { message: 'Price is required' });
    min(path.price, 1, { message: 'Price must be greater than 0' });

    required(path.stock, { message: 'Stock is required' });
    min(path.stock, 0, { message: 'Stock cannot be negative' });

    required(path.category, { message: 'Category is required' });
    required(path.brand, { message: 'Brand is required' });
    required(path.sku, { message: 'SKU is required' });
    required(path.status, { message: 'Status is required' });
    required(path.availabilityStatus, { message: 'Availability status is required' });
};