export interface OrderResponse {
    carts: Order[];
    total: number;
    skip: number;
    limit: number;
}

export interface Order {
    id: number;
    products: OrderProduct[];
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;

    // UI only
    status: OrderStatus;
    paymentStatus: PaymentStatus;
}

export interface OrderProduct {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
    thumbnail: string;
}

export type OrderStatus = | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentStatus = | 'Paid' | 'Pending' | 'Refunded';