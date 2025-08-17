import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { CouponService } from './coupon.service';
import { Coupon } from '../models/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'ecommerce_cart';
  private readonly COUPON_STORAGE_KEY = 'ecommerce_coupon';

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private appliedCouponSubject = new BehaviorSubject<Coupon | null>(null);

  cartItems$ = this.cartItemsSubject.asObservable();
  appliedCoupon$ = this.appliedCouponSubject.asObservable();

  constructor(private couponService: CouponService) {
    this.loadCartFromStorage();
    this.loadCouponFromStorage();
  }

  addToCart(product: Product, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].totalPrice = 
        updatedItems[existingItemIndex].product.price * updatedItems[existingItemIndex].quantity;
      
      this.cartItemsSubject.next(updatedItems);
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        totalPrice: product.price * quantity
      };
      
      this.cartItemsSubject.next([...currentItems, newItem]);
    }

    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(filteredItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity,
          totalPrice: item.product.price * quantity
        };
      }
      return item;
    });

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  applyCoupon(couponCode: string): boolean {
    const coupon = this.couponService.validateCoupon(couponCode);
    if (coupon) {
      this.appliedCouponSubject.next(coupon);
      this.saveCouponToStorage(coupon);
      return true;
    }
    return false;
  }

  removeCoupon(): void {
    this.appliedCouponSubject.next(null);
    localStorage.removeItem(this.COUPON_STORAGE_KEY);
  }

  getCartTotal(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((total, item) => total + item.totalPrice, 0);
  }

  getCartTotalWithDiscount(): number {
    const items = this.cartItemsSubject.value;
    const appliedCoupon = this.appliedCouponSubject.value;
    
    if (!appliedCoupon) {
      return this.getCartTotal();
    }

    let total = 0;
    let totalDiscount = 0;

    items.forEach(item => {
      const itemTotal = item.totalPrice;
      const discount = this.couponService.calculateDiscount(appliedCoupon, item.product.price) * item.quantity;
      
      total += itemTotal;
      totalDiscount += discount;
    });

    return total - totalDiscount;
  }

  getTotalDiscount(): number {
    const items = this.cartItemsSubject.value;
    const appliedCoupon = this.appliedCouponSubject.value;
    
    if (!appliedCoupon) {
      return 0;
    }

    return items.reduce((totalDiscount, item) => {
      const discount = this.couponService.calculateDiscount(appliedCoupon, item.product.price) * item.quantity;
      return totalDiscount + discount;
    }, 0);
  }

  getItemCount(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.appliedCouponSubject.next(null);
    localStorage.removeItem(this.CART_STORAGE_KEY);
    localStorage.removeItem(this.COUPON_STORAGE_KEY);
  }

  private saveCartToStorage(): void {
    const cartData = this.cartItemsSubject.value;
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cartData));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart) as CartItem[];
        this.cartItemsSubject.next(cartItems);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCouponToStorage(coupon: Coupon): void {
    localStorage.setItem(this.COUPON_STORAGE_KEY, JSON.stringify(coupon));
  }

  private loadCouponFromStorage(): void {
    const savedCoupon = localStorage.getItem(this.COUPON_STORAGE_KEY);
    if (savedCoupon) {
      try {
        const coupon = JSON.parse(savedCoupon) as Coupon;
        this.appliedCouponSubject.next(coupon);
      } catch (error) {
        console.error('Error loading coupon from storage:', error);
      }
    }
  }
}