import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../../services/cart.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  template: `
    <div class="surface-ground min-h-screen flex align-items-center justify-content-center p-4">
        <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
            <div class="text-center mb-5">
                <div class="text-900 text-3xl font-medium mb-3">Checkout</div>
                <span class="text-600 font-medium line-height-3">Complete su orden</span>
            </div>

            <div *ngFor="let item of cartItems" class="flex justify-content-between align-items-center mb-3 border-bottom-1 surface-border pb-2">
                <div>
                    <span class="font-bold">{{ item.quantity }}x</span> {{ item.meal.name }}
                </div>
                <span class="font-bold">{{ (item.meal.price * item.quantity) | currency }}</span>
            </div>

            <div class="flex justify-content-between align-items-center mb-5">
                <span class="text-xl font-bold">Total</span>
                <span class="text-xl font-bold text-primary">{{ total | currency }}</span>
            </div>

            <div *ngIf="elementsOptions?.clientSecret">
                <ngx-stripe-elements [elementsOptions]="elementsOptions">
                    <ngx-stripe-payment [options]="paymentElementOptions"></ngx-stripe-payment>
                </ngx-stripe-elements>
                <button pButton label="Pagar {{ total | currency }}" class="w-full mt-4" (click)="pay()" [loading]="paying"></button>
            </div>
            <div *ngIf="!elementsOptions?.clientSecret && total > 0">
                <p>Cargando opciones de pago...</p>
            </div>
             <div *ngIf="total === 0">
                <p>El carrito está vacío.</p>
                <button pButton label="Volver al Menú" class="w-full mt-4 p-button-secondary" (click)="back()"></button>
            </div>
        </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;

  cartItems: any[] = [];
  total = 0;
  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };
  paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs'
  };
  paying = false;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private stripeService: StripeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
      if (this.total > 0) {
        this.createPaymentIntent();
      }
    });
  }

  createPaymentIntent() {
    const items = this.cartItems.map(i => ({ mealId: i.meal.id, quantity: i.quantity }));
    this.http.post<any>(`${environment.apiBase}Payments/create-payment-intent`, { items })
      .subscribe(res => {
        this.elementsOptions.clientSecret = res.clientSecret;
      });
  }

  pay() {
    if (this.paying) return;
    this.paying = true;

    this.stripeService.confirmPayment({
      elements: this.paymentElement.elements,
      confirmParams: {
        return_url: window.location.origin + '/public/success',
      },
      redirect: 'if_required'
    }).subscribe(result => {
      this.paying = false;
      if (result.error) {
        // Show error
        console.error(result.error);
        alert(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
            // Create Order in Backend
            this.createOrders();
        }
      }
    });
  }

  createOrders() {
      const tableId = this.cartService.getTableId();
      if (!tableId) {
          alert('Error: No se ha identificado la mesa. Por favor escanee el código QR nuevamente.');
          return;
      }

      const orders = this.cartItems.map(item => ({
          tableId: tableId,
          mealId: item.meal.id,
          quantity: item.quantity,
          // Default values
          statusOrderId: 1,
          isPay: true // Since we just paid via Stripe
      }));

      this.http.post(`${environment.apiBase}PublicOrders`, orders).subscribe({
          next: () => {
              this.cartService.clearCart();
              alert('¡Pago exitoso! Su orden ha sido enviada a cocina.');
              this.router.navigate(['/public/menu']);
          },
          error: (err) => {
              console.error(err);
              alert('Hubo un error al enviar la orden a cocina, pero el pago fue procesado. Por favor avise a un mesero.');
          }
      });
  }

  back() {
      this.router.navigate(['/public/menu']);
  }
}
