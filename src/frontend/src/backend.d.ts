import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    total: bigint;
    paymentMethod: PaymentMethod;
    user: Principal;
    timestamp: Time;
    shippingAddress: string;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    title: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    currency: string;
    category: string;
    rating?: bigint;
    price: bigint;
}
export enum PaymentMethod {
    cod = "cod"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addItemToCart(productId: bigint, quantity: bigint): Promise<void>;
    addProduct(title: string, description: string, price: bigint, currency: string, category: string, imageUrl: string, rating: bigint | null, stock: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getOrder(orderId: bigint): Promise<Order>;
    getProductById(productId: bigint): Promise<Product>;
    getSupportedCategories(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllProducts(): Promise<Array<Product>>;
    listMyOrders(): Promise<Array<Order>>;
    listProductsByCategory(category: string): Promise<Array<Product>>;
    placeOrder(shippingAddress: string, paymentMethod: PaymentMethod, country: string): Promise<bigint>;
    removeCartItem(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(keyword: string): Promise<Array<Product>>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<void>;
    updateProduct(productId: bigint, title: string, description: string, price: bigint, currency: string, category: string, imageUrl: string, rating: bigint | null, stock: bigint): Promise<void>;
    updateStock(productId: bigint, stock: bigint): Promise<void>;
}
