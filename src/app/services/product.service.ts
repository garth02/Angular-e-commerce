import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 299.99,
      image: 'images/headphone.png',
      description: 'High-quality wireless headphones'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: 'images/watch.png',
      description: 'Feature-rich smartwatch'
    },
    {
      id: 3,
      name: 'Laptop Stand',
      price: 49.99,
      image: 'images/stand.jpg',
      description: 'Ergonomic laptop stand'
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      price: 149.99,
      image: 'images/keyboard.jpg',
      description: 'RGB mechanical keyboard'
    },
    {
      id: 5,
      name: 'Gaming Mouse',
      price: 79.99,
      image: 'images/mouse.jpg',
      description: 'High-precision gaming mouse'
    },
    {
      id: 6,
      name: 'Professional Monitor',
      price: 449.99,
      image: 'images/monitor.jpg',
      description: '27-inch 4K monitor'
    }
  ];

  getProducts(): Observable<Product[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.mockProducts);
        observer.complete();
      }, 500);
    });
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.mockProducts.find(product => product.id === id));
  }
}