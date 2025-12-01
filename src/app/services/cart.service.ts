import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  meal: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  private tableIdSubject = new BehaviorSubject<number | null>(null);
  tableId$ = this.tableIdSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.itemsSubject.next(JSON.parse(saved));
    }
    const savedTableId = localStorage.getItem('tableId');
    if (savedTableId) {
        this.tableIdSubject.next(Number(savedTableId));
    }
  }

  setTableId(id: number) {
      this.tableIdSubject.next(id);
      localStorage.setItem('tableId', id.toString());
  }

  getTableId(): number | null {
      return this.tableIdSubject.value;
  }

  addToCart(meal: any) {
    const current = this.itemsSubject.value;
    const existing = current.find(i => i.meal.id === meal.id);
    if (existing) {
      existing.quantity++;
    } else {
      current.push({ meal, quantity: 1 });
    }
    this.updateCart(current);
  }

  removeFromCart(mealId: number) {
    const current = this.itemsSubject.value.filter(i => i.meal.id !== mealId);
    this.updateCart(current);
  }

  clearCart() {
    this.updateCart([]);
    // Do not clear tableId as the user might order again
  }

  private updateCart(items: CartItem[]) {
    this.itemsSubject.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }

  getTotal() {
    return this.itemsSubject.value.reduce((acc, item) => acc + (item.meal.price * item.quantity), 0);
  }
}
