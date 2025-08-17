import { Injectable } from '@angular/core';
import { Coupon } from '../models/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private availableCoupons: Coupon[] = [
    {
      code: 'SAVE10',
      discount: 0.1,
      minAmount: 100,
      maxDiscount: 50
    }
  ];

  validateCoupon(code: string): Coupon | null {
    return this.availableCoupons.find(coupon => 
      coupon.code.toLowerCase() === code.toLowerCase()
    ) || null;
  }

  calculateDiscount(coupon: Coupon, itemPrice: number): number {
    if (itemPrice < coupon.minAmount) {
      return 0;
    }
    
    const discountAmount = itemPrice * coupon.discount;
    return Math.min(discountAmount, coupon.maxDiscount);
  }
}