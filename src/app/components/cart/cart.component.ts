import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Coupon } from '../../models/coupon.model';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [FormsModule, DecimalPipe, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  appliedCoupon: Coupon | null = null;
  couponCode = '';
  couponError = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.checkCouponRequirements();
    });

    this.cartService.appliedCoupon$.subscribe(coupon => {
      this.appliedCoupon = coupon;
    });
  }

  updateQuantity(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = Math.max(1, parseInt(input.value, 10) || 1);
    
    this.cartService.updateQuantity(productId, newQuantity);
    this.couponError = '';
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.couponError = '';
  }

  applyCoupon(): void {
    this.couponError = '';
    
    const code = this.couponCode.trim();
    if (!code) {
      this.couponError = 'Please enter a coupon code';
      return;
    }

    // Check if there are any eligible items (items $100 or above)
    const hasEligibleItems = this.cartItems.some(item => item.product.price >= 100);
    if (!hasEligibleItems) {
      this.couponError = 'No eligible items. Coupon only applies to items $100 and above.';
      return;
    }


    const success = this.cartService.applyCoupon(code);
    if (success) {
      this.couponCode = ''; 
    } else {
      this.couponError = 'Invalid coupon code';
    }
  }

  removeCoupon(): void {
    this.cartService.removeCoupon();
    this.couponError = '';
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart();
      this.couponError = '';
    }
  }

  private checkCouponRequirements(): void {
    this.couponError = '';
    
    // If cart is empty, remove any applied coupon
    if (this.cartItems.length === 0 && this.appliedCoupon) {
      this.cartService.removeCoupon();
      return;
    }

    // If no eligible items remain (no items $100+), remove coupon
    const hasEligibleItems = this.cartItems.some(item => item.product.price >= 100);
    if (!hasEligibleItems && this.appliedCoupon) {
      this.cartService.removeCoupon();
    }
  }

  // Calculate total price before any discounts
  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  // Calculate total discount amount
  getDiscount(): number {
    if (!this.appliedCoupon || this.cartItems.length === 0) {
      return 0;
    }

    if (this.appliedCoupon.code === 'SAVE10') {
      let totalDiscount = 0;
      
      this.cartItems.forEach(item => {
        // SAVE10 only applies to items $100 and above
        if (item.product.price >= 100) {
          const itemSubtotal = item.product.price * item.quantity;
          // 10% discount on the total for this item type
          const tenPercentDiscount = itemSubtotal * 0.1;
          // But cap the total discount for this item type at $50
          const actualDiscountForThisItemType = Math.min(tenPercentDiscount, 50);
          totalDiscount += actualDiscountForThisItemType;
        }
        // If item is under $100, no discount applies
      });
      return totalDiscount;
    }
    return this.cartService.getTotalDiscount();
  }

  // Calculate final total after discounts
  getTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    return subtotal - discount;
  }
  getItemCount(): number {
    return this.cartService.getItemCount();
  }
  trackByProductId(index: number, item: CartItem): number {
    return item.product.id;
  }
  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }
  hasDiscount(): boolean {
    return this.getDiscount() > 0;
  }
}