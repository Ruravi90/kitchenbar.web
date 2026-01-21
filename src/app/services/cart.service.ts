import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

export interface CartItem {
  meal: any;
  quantity: number;
  comment?: string;
  branchId?: number;
  branchName?: string;
}

interface CartState {
  items: CartItem[];
  branchId: number | null;
  branchName: string | null;
  tableId: number | null;
  instanceIdentity: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private stateSubject = new BehaviorSubject<CartState>(this.loadFromStorage());
  public state$ = this.stateSubject.asObservable();

  // Convenience observables
  public items$: Observable<CartItem[]>;
  public total$: Observable<number>;
  public itemCount$: Observable<number>;

  constructor() {
    // Derived observables
    this.items$ = new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.items));
    });

    this.total$ = new Observable(observer => {
      this.state$.subscribe(state => {
        const total = state.items.reduce((acc, item) => acc + (item.meal.price * item.quantity), 0);
        observer.next(total);
      });
    });

    this.itemCount$ = new Observable(observer => {
      this.state$.subscribe(state => {
        const count = state.items.reduce((acc, item) => acc + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  private loadFromStorage(): CartState {
    const saved = localStorage.getItem('cart_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading cart from storage:', e);
      }
    }
    return {
      items: [],
      branchId: null,
      branchName: null,
      tableId: null,
      instanceIdentity: null
    };
  }

  private saveToStorage(state: CartState) {
    localStorage.setItem('cart_state', JSON.stringify(state));
    this.stateSubject.next(state);
  }

  /**
   * Set the current branch/instance context
   */
  setContext(branchId: number, branchName: string, instanceIdentity?: string) {
    const current = this.stateSubject.value;
    
    // If changing branch and cart has items, clear cart
    if (current.branchId && current.branchId !== branchId && current.items.length > 0) {
      console.warn('Clearing cart due to branch change');
      this.clear();
    }

    this.saveToStorage({
      ...current,
      branchId,
      branchName,
      instanceIdentity: instanceIdentity || current.instanceIdentity
    });
  }

  setTableId(tableId: number) {
    const current = this.stateSubject.value;
    this.saveToStorage({ ...current, tableId });
  }

  /**
   * Add item to cart with optional comment
   */
  addItem(meal: any, quantity: number = 1, comment?: string, branchId?: number, branchName?: string): Observable<CartItem> {
    const current = this.stateSubject.value;

    // Validate branch consistency
    if (branchId && current.branchId && current.branchId !== branchId) {
      return throwError(() => new Error('No puedes agregar items de diferentes restaurantes al carrito'));
    }

    // Find existing item
    const existingIndex = current.items.findIndex(i => 
      i.meal.id === meal.id && i.comment === comment
    );

    let updatedItems: CartItem[];

    if (existingIndex >= 0) {
      // Update quantity of existing item
      updatedItems = [...current.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity
      };
    } else {
      // Add new item
      const newItem: CartItem = {
        meal,
        quantity,
        comment,
        branchId: branchId || current.branchId || undefined,
        branchName: branchName || current.branchName || undefined
      };
      updatedItems = [...current.items, newItem];
    }

    const newState: CartState = {
      ...current,
      items: updatedItems,
      branchId: branchId || current.branchId,
      branchName: branchName || current.branchName
    };

    this.saveToStorage(newState);

    return new Observable(observer => {
      observer.next(updatedItems[existingIndex >= 0 ? existingIndex : updatedItems.length - 1]);
      observer.complete();
    });
  }

  /**
   * Update quantity of specific cart item
   */
  updateQuantity(index: number, quantity: number) {
    const current = this.stateSubject.value;
    
    if (index < 0 || index >= current.items.length) return;

    const updatedItems = [...current.items];
    
    if (quantity <= 0) {
      updatedItems.splice(index, 1);
    } else {
      updatedItems[index] = { ...updatedItems[index], quantity };
    }

    this.saveToStorage({ ...current, items: updatedItems });
  }

  /**
   * Remove item from cart by index
   */
  removeItem(index: number) {
    const current = this.stateSubject.value;
    
    if (index < 0 || index >= current.items.length) return;

    const updatedItems = [...current.items];
    updatedItems.splice(index, 1);

    this.saveToStorage({ ...current, items: updatedItems });
  }

  /**
   * Clear entire cart
   */
  clear() {
    const current = this.stateSubject.value;
    this.saveToStorage({
      ...current,
      items: [],
      branchId: null,
      branchName: null,
      instanceIdentity: null
    });
  }

  /**
   * Get current cart items
   */
  getItems(): CartItem[] {
    return this.stateSubject.value.items;
  }

  /**
   * Get current total
   */
  getTotal(): number {
    return this.stateSubject.value.items.reduce(
      (acc, item) => acc + (item.meal.price * item.quantity), 
      0
    );
  }

  /**
   * Get current state
   */
  getState(): CartState {
    return this.stateSubject.value;
  }

  /**
   * Check if cart has items
   */
  hasItems(): boolean {
    return this.stateSubject.value.items.length > 0;
  }

  /**
   * Get item count
   */
  getItemCount(): number {
    return this.stateSubject.value.items.reduce((acc, item) => acc + item.quantity, 0);
  }
}
