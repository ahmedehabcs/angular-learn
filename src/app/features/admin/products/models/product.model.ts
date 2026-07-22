export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    sku: string;
    availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
    thumbnail: string;
    images: string[];
    status: 'Active' | 'Inactive';
}

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface Category {
    name: string;
    slug: string;
    url: string;
}