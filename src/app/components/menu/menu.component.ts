import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesInterface, MealsInterface, OrdersInterface, DinersInterface, InvoicesInterface, AuthInterface } from '../../interfaces';
import { MessageService } from 'primeng/api';
import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface CartItem {
  meal: any;
  quantity: number;
  comment?: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [MessageService]
})
export class MenuComponent implements OnInit {
  categories: any[] = [];
  meals: any[] = [];
  filteredMeals: any[] = [];
  selectedCategory: any = null;
  
  sortOptions: any[] = [];
  sortOrder: number = 0;
  sortField: string = '';

  displayDetails: boolean = false;
  selectedMeal: any = null;

  cart: CartItem[] = [];
  cartVisible: boolean = false;

  // Add to cart dialog properties
  showAddToCartDialog: boolean = false;
  selectedMealForCart: any = null;
  orderComment: string = '';
  orderQuantity: number = 1;

  categoryOptions: any[] = [];

  tableId?: number;
  dinerId?: number;
  identity?: string;
  tableIdentity?: string;

  groupedMeals: { category: any, meals: any[] }[] = [];

  accountVisible: boolean = false;
  invoiceVisible: boolean = false;
  dinerDetails: any = null;
  fiscalData: any = {
    rfc: '',
    legalName: '',
    taxRegime: '',
    zipCode: '',
    address: '',
    email: '',
    useCfdi: 'G03'
  };

  isLogin: boolean = false;

  // Stripe payment properties
  @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;
  paymentVisible: boolean = false;
  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };
  paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs'
  };
  paying: boolean = false;
  paymentMethod: 'cash' | 'online' | null = null;
  showPaymentMethodDialog: boolean = false;

  constructor(
    private categoriesService: CategoriesInterface,
    private mealsService: MealsInterface,
    private ordersService: OrdersInterface,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private dinersService: DinersInterface,
    private invoicesService: InvoicesInterface,
    private authService: AuthInterface,
    private stripeService: StripeService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.isLogin = this.authService.checkLogin();

    this.route.params.subscribe(params => {
      const identity = params['identity'];
      if (identity) {
        this.identity = identity;
        this.loadData(identity);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No restaurant identity provided.' });
      }
    });

    this.route.queryParams.subscribe(params => {
      this.tableId = params['tableId'] ? +params['tableId'] : undefined;
      this.dinerId = params['dinerId'] ? +params['dinerId'] : undefined;
      this.tableIdentity = params['tableIdentity'] ? params['tableIdentity'] : undefined;
      
      if (this.dinerId) {
        this.loadDinerDetails();
      }
    });
    
    this.sortOptions = [
      { label: 'Precio: Mayor a Menor', value: '!price' },
      { label: 'Precio: Menor a Mayor', value: 'price' }
    ];
  }

  goBack() {
    if (this.tableIdentity) {
      this.router.navigate(['/client', this.tableIdentity]);
    }
  }

  loadData(identity: string) {
    this.categoriesService.getPublic(identity).subscribe({
      next: (cats) => {
        this.categories = cats;
        this.categoryOptions = [{ name: 'Todas', id: null }, ...cats];
        this.selectedCategory = this.categoryOptions[0];
        this.groupMeals();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías' });
      }
    });

    this.mealsService.getPublic(identity).subscribe({
      next: (meals) => {
        this.meals = meals;
        this.filteredMeals = meals;
        this.groupMeals();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar platillos' });
      }
    });
  }

  groupMeals() {
    if (!this.categories.length || !this.meals.length) return;

    if (this.selectedCategory && this.selectedCategory.id) {
      const cat = this.categories.find(c => c.id === this.selectedCategory.id);
      if (cat) {
        const catMeals = this.meals.filter(m => m.categoryId === cat.id);
        this.groupedMeals = [{ category: cat, meals: catMeals }];
      }
    } else {
      this.groupedMeals = this.categories.map(cat => {
        return {
          category: cat,
          meals: this.meals.filter(m => m.categoryId === cat.id)
        };
      }).filter(group => group.meals.length > 0);
    }
  }

  onCategoryChange(category: any) {
    this.selectedCategory = category;
    this.groupMeals();
  }

  getNameCategory(categoryId: number) {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  showDetails(meal: any) {
    this.selectedMeal = meal;
    this.displayDetails = true;
  }

  addToCart(meal: any) {
    this.selectedMealForCart = meal;
    this.orderComment = '';
    this.orderQuantity = 1;
    this.showAddToCartDialog = true;
  }

  confirmAddToCart() {
    if (!this.selectedMealForCart) return;
    
    const cartItem: CartItem = {
      meal: this.selectedMealForCart,
      quantity: this.orderQuantity,
      comment: this.orderComment.trim() || undefined
    };
    
    this.cart.push(cartItem);
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Agregado al Carrito', 
      detail: this.selectedMealForCart.name 
    });
    
    this.showAddToCartDialog = false;
    this.selectedMealForCart = null;
    this.orderComment = '';
    this.orderQuantity = 1;
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  get cartTotal() {
    return this.cart.reduce((acc, item) => acc + (item.meal.price * item.quantity), 0);
  }

  // ... existing methods ...

  placeOrder() {
    if (this.cart.length === 0) return;

    if (!this.isLogin) {
        if (!this.tableId) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha identificado la mesa.' });
            return;
        }

        const orders = this.cart.map(item => ({
            tableId: this.tableId,
            mealId: item.meal.id,
            quantity: item.quantity,
            aditional: item.comment,
            dinerId: this.dinerId || 0,
            statusOrderId: 1
        }));

        this.ordersService.createPublicItem(orders).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Orden Enviada', detail: 'Tu orden ha sido enviada a la cocina.' });
                this.cart = [];
                this.cartVisible = false;
                // Optionally redirect to attendance/client view
                if (this.tableIdentity) {
                    this.router.navigate(['/client', this.tableIdentity]);
                }
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar la orden.' });
            }
        });
    } else {
        // Logged in user (Waiter) - Send items one by one as OrdersController expects single Order
        // Ideally backend should support bulk, but sticking to existing pattern for now
        // We use recursion or Promise.all to handle multiple requests
        
        const promises = this.cart.map(item => {
            const order = {
                mealId: item.meal.id,
                quantity: item.quantity,
                aditional: item.comment,
                tableId: this.tableId,
                dinerId: this.dinerId,
                statusOrderId: 1
            };
            return this.ordersService.createItem(order).toPromise();
        });

        Promise.all(promises).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Orden Enviada', detail: 'La orden ha sido enviada.' });
            this.cart = [];
            this.cartVisible = false;
        }).catch(err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar parte de la orden.' });
        });
    }
  }

  onRate(meal: any, event: any) {
    this.mealsService.rate(meal.id, event.value).subscribe({
      next: (response) => {
        meal.rating = response.rating;
        meal.ratingCount = response.ratingCount;
        this.messageService.add({ severity: 'success', summary: 'Gracias', detail: 'Tu calificación ha sido guardada.' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar tu calificación.' });
      }
    });
  }

  loadDinerDetails() {
    if (!this.dinerId) return;
    this.dinersService.getItem(this.dinerId).subscribe({
      next: (diner) => {
        this.dinerDetails = diner;
      },
      error: (err) => {
        console.error('Error loading diner details', err);
      }
    });
  }

  get dinerTotal() {
    if (!this.dinerDetails || !this.dinerDetails.orders) return 0;
    // Assuming orders have price or we calculate it. 
    // Since we don't have price in order, we might need to fetch meals or use what we have.
    // For simplicity, let's assume the backend or a previous step populated prices, 
    // or we just sum up based on the meals we loaded.
    // Ideally, the backend should return the total.
    // Let's try to match orders with loaded meals to get price.
    let total = 0;
    this.dinerDetails.orders.forEach((order: any) => {
        const meal = this.meals.find(m => m.id === order.mealId);
        if (meal) {
            total += meal.price * order.quantity;
        }
    });
    return total;
  }

  selectPaymentMethod(method: 'cash' | 'online') {
    this.paymentMethod = method;
    this.showPaymentMethodDialog = false;
    this.accountVisible = false;
    
    if (method === 'online') {
      this.createPaymentIntent();
      this.paymentVisible = true;
    } else {
      this.payTicket();
    }
  }

  createPaymentIntent() {
    if (!this.dinerId) return;
    
    const amount = this.dinerTotal;
    this.http.post<any>(`${environment.apiBase}Payments/create-payment-intent-diner`, { 
      dinerId: this.dinerId,
      amount: amount 
    }).subscribe({
      next: (res) => {
        this.elementsOptions.clientSecret = res.clientSecret;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo iniciar el pago.' });
        this.paymentVisible = false;
      }
    });
  }

  confirmPayment() {
    if (this.paying || !this.paymentElement) return;
    this.paying = true;

    this.stripeService.confirmPayment({
      elements: this.paymentElement.elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required'
    }).subscribe({
      next: (result) => {
        this.paying = false;
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.error.message || 'Error al procesar el pago.' });
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            this.payTicket();
            this.paymentVisible = false;
          }
        }
      },
      error: (err) => {
        this.paying = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al procesar el pago.' });
      }
    });
  }

  payTicket() {
    if (!this.dinerId) return;
    this.dinersService.closeTicket(this.dinerId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Pago Exitoso', detail: 'Tu cuenta ha sido pagada.' });
        this.loadDinerDetails(); // Reload to update status
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo procesar el pago.' });
      }
    });
  }

  requestInvoice() {
    if (!this.dinerId) return;
    
    const request = {
      dinerId: this.dinerId,
      ...this.fiscalData
    };

    this.invoicesService.generateInvoice(request).subscribe({
      next: (invoice) => {
        this.messageService.add({ severity: 'success', summary: 'Factura Generada', detail: 'Tu factura ha sido enviada a tu correo.' });
        this.invoiceVisible = false;
        // Optionally open the PDF
        if (invoice.pdfUrl) {
            window.open(invoice.pdfUrl, '_blank');
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar la factura. Verifique sus datos.' });
      }
    });
  }
}
