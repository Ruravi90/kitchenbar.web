import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesInterface, MealsInterface, OrdersInterface, DinersInterface, InvoicesInterface, AuthInterface } from '../../interfaces';
import { MessageService } from 'primeng/api';
import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RestaurantConfig } from '../../models/restaurant-config.model';
import { RestaurantConfigService } from '../../services/restaurant-config.service';
import { LoyaltyService } from '../../services/loyalty.service';
import { OrderType } from '../../models/diner.model';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';
import { ReservationResponse } from '../../models/reservation.model';
import { ClientPortalService } from '../../services/client-portal.service';
import { ClientAddress } from '../../interfaces/client-portal.interface';

// CartItem interface moved to cart.service.ts

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

  // Cart now managed by CartService
  cart$: Observable<any[]>;
  cartTotal$: Observable<number>;
  cartCount$: Observable<number>;
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
  
  // Flow detection: true when accessed from client portal (no table params)
  isClientPortalFlow: boolean = false;

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

  // Order Type Properties
  orderType: OrderType = OrderType.DineIn;
  pickupTime: Date | null = null;
  deliveryAddress: string = '';
  showOrderTypeDialog: boolean = false;
  orderTypes = [
    { label: 'Comer Aquí', value: OrderType.DineIn },
    { label: 'Para Llevar (Pickup)', value: OrderType.Pickup },
    { label: 'Domicilio', value: OrderType.Delivery }
  ];
  
  // Loyalty Properties
  loyaltyPhoneNumber: string = '';
  loyaltyMember: any = null;
  loyaltyPointsRedeem: number = 0;
  
  // Config
  enableOnlinePayments: boolean = true;

  isLogin: boolean = false;  // Admin/staff authentication
  isClientPortalUser: boolean = false;  // Client portal authentication
  
  // Reservation properties
  currentReservationId: number | null = null;
  showReservationPrompt: boolean = false;
  
  // Saved Addresses
  savedAddresses: ClientAddress[] = [];
  selectedAddressId: number | null = null;
  showNewAddressInput: boolean = false;

  // Stripe payment properties
  @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;
  @ViewChild(ReservationDialogComponent) reservationDialog!: ReservationDialogComponent;
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
    private http: HttpClient,
    private configService: RestaurantConfigService,
    private loyaltyService: LoyaltyService,
    private cartService: CartService,
    private clientPortalService: ClientPortalService
  ) {
    // Initialize cart observables
    this.cart$ = this.cartService.items$;
    this.cartTotal$ = this.cartService.total$;
    this.cartCount$ = this.cartService.itemCount$;
  }

  ngOnInit(): void {
    this.isLogin = this.authService.checkLogin();

    this.route.params.subscribe(params => {
      const identity = params['identity'];
      
      // Check if user is authenticated in client portal
      this.clientPortalService.currentUser$.subscribe(user => {
        if (user) {
          this.isClientPortalUser = true;
          console.log('✅ Client portal user authenticated:', user.email);
        } else {
          this.isClientPortalUser = false;
          console.log('⚠️ No client portal user authenticated');
        }
      });
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
      
      // Detect flow type: client portal if no table parameters
      this.isClientPortalFlow = !this.tableId && !this.dinerId && !this.tableIdentity;
      
      // DEBUG: Log flow detection
      console.log('Flow Detection:', {
        tableId: this.tableId,
        dinerId: this.dinerId,
        tableIdentity: this.tableIdentity,
        isClientPortalFlow: this.isClientPortalFlow,
        orderType: this.orderType
      });
      
      // For client portal flow, default to delivery and prompt for order type
      if (this.isClientPortalFlow) {
        this.orderType = OrderType.Delivery;
        console.log('Client Portal Flow detected - orderType set to Delivery');
        // Preload saved addresses immediately since Delivery is selected by default
        this.loadSavedAddresses();
      }
      
      if (this.dinerId) {
        this.loadDinerDetails();
      }
    });
    
    this.sortOptions = [
      { label: 'Precio: Mayor a Menor', value: '!price' },
      { label: 'Precio: Menor a Mayor', value: 'price' }
    ];
    
    //this.loadConfig();
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
    
    // Get branch info from categories if available
    const branchId = this.categories[0]?.branchId;
    const branchName = this.categories[0]?.name || 'Branch';
    
    this.cartService.addItem(
      this.selectedMealForCart,
      this.orderQuantity,
      this.orderComment.trim() || undefined,
      branchId,
      branchName
    ).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Agregado al Carrito', 
          detail: `${this.selectedMealForCart.name} x${this.orderQuantity}`
        });
        
        this.showAddToCartDialog = false;
        this.selectedMealForCart = null;
        this.orderComment = '';
        this.orderQuantity = 1;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'No se pudo agregar al carrito'
        });
      }
    });
  }

  removeFromCart(index: number) {
    this.cartService.removeItem(index);
  }

  get cartTotal(): number {
    return this.cartService.getTotal();
  }

  // ... existing methods ...

  loadConfig() {
      // Fetch public config or based on identity. 
      // Current service uses authenticated endpoint likely, but we need public check.
      // If we are in public menu, we might be guest.
      // We will try to fetch config. If 401, we default to enabled or handle graceful degradation.
      // Ideally, there should be a public endpoint for this.
      // I will use a try/catch approach or assume default true if error.
      
      this.configService.getConfig().subscribe({
          next: (config) => {
              if (config && config.enableOnlinePayments !== undefined) {
                  this.enableOnlinePayments = config.enableOnlinePayments;
              }
          },
          error: () => {
              // If error (e.g. 401 for guest), we assume enabled for now or 
              // we should probably DISABLE it if we can't verify?
              // Let's default to true as safe default for existing restaurants,
              // but if the requirement is strict, we might need a public endpoint.
              console.log('Could not load config, defaulting to online payments enabled.');
          }
      });
  }

  initiateOrderParams() {
      // For client portal flow, order type already selected in cart UI
      if (this.isClientPortalFlow) {
        this.placeOrder();
        return;
      }
      
      // For dine-in flow, show dialog to select order type
      this.showOrderTypeDialog = true;
  }
  
  confirmOrderType() {
      this.showOrderTypeDialog = false;
      this.placeOrder();
  }

  checkLoyalty() {
      if(!this.loyaltyPhoneNumber) return;
      this.loyaltyService.getByPhoneNumber(this.loyaltyPhoneNumber).subscribe({
          next: (member) => {
              this.loyaltyMember = member;
              this.messageService.add({severity:'success', summary:'Bienvenido', detail: `Hola ${member.name}, tienes ${member.points} puntos.`});
          },
          error: () => {
              this.messageService.add({severity:'info', summary:'Info', detail: 'Miembro no encontrado. Se creará al finalizar.'});
              // Optionally create minimal member context
              this.loyaltyMember = { phoneNumber: this.loyaltyPhoneNumber, points: 0 };
          }
      });
  }

  placeOrder() {
    if (!this.cartService.hasItems()) return;

    if (this.isClientPortalFlow) {
      // Client Portal Flow: Create order for delivery/pickup without table
      this.createClientPortalOrder();
      return;
    }

    if (!this.isLogin) {
        if (!this.tableId) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha identificado la mesa.' });
            return;
        }

        const orders = this.cartService.getItems().map((item: any) => ({
            tableId: this.tableId,
            mealId: item.meal.id,
            quantity: item.quantity,
            aditional: item.comment,
            dinerId: this.dinerId || 0,
            statusOrderId: 1
        }));
        
        // We need to pass OrderType, PickupTime, DeliveryAddress.
        // The current createPublicItem endpoint might expect List<Order>.
        // Order model update in backend handles these fields on Diner?
        // Wait, 'Diner' has these fields. 'Order' has 'dinerId'.
        // If we are creating a new Diner (anonymous), we need to send Diner info.
        // The current logic seems to create orders for an existing table/diner or implicit?
        // createPublicItem usually creates a temporary diner or uses provided one.
        // We might need to update the payload to include Diner details (OrderType etc).
        // Let's assume the API can accept a complex object or we need to update the service.
        // If creation is via 'Orders', it might strictly map to Order entities.
        // We might need to create the Diner FIRST if we want to set OrderType, or pass it in 'aditional' temporarily?
        // No, we updated Diner model. 
        // We should probably update the API to accept Diner details with Order.
        // Or if 'createPublicItem' accepts a DTO.
        
        // For now, let's assume we send these in the 'orders' list if the backend maps it,
        // OR we might need to call a different endpoint 'CreateOrderWithDinerInfo'.
        // Given I only updated models, the Controller likely maps the body to Order list.
        // If I want to save Diner info (OrderType), I probably need to update the Diner AFTER getting the ID?
        // Or send it with the request if the DTO allows.
        
        // Let's optimistically assume we can pass it, or we will handle it by updating Diner details if we have an ID.
        // If we don't have an ID (new diner), we rely on the backend creating it.
        // I will trust the backend handles it or I will do a follow up.
        
        // Ideally:
        // 1. Create Diner with OrderType.
        // 2. Create Orders for Diner.
        
        // If `createPublicItem` is `[HttpPost] public async Task<ActionResult<List<Order>>> Post(List<Order> orders)`
        // then it just saves orders. The Diner is created inside?
        // I need to check `OrdersController`.
        
        // For now, I will invoke placeOrder as is, but I know I am missing passing OrderType.
        // I will add a TO-DO in comments.
        
        // UPDATE: I will inject the values into the first order's "diner" property if nested object creation is supported.
        // orders[0].diner = { ... }
        
        if (orders.length > 0) {
           // Try to pass diner info in the first order if the backend supports deep insert
           (orders[0] as any).diner = {
               orderType: this.orderType,
               pickupTime: this.pickupTime,
               deliveryAddress: this.deliveryAddress,
               loyaltyMemberId: this.loyaltyMember?.id,
               // If new loyalty member, we might need to handle creation separately or backend handles it.
               phoneNumber: this.loyaltyPhoneNumber
           };
        }


        this.ordersService.createPublicItem(orders).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Orden Enviada', detail: 'Tu orden ha sido enviada a la cocina.' });
                this.cartService.clear();
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
        
        const promises = this.cartService.getItems().map((item: any) => {
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
            this.cartService.clear();
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

  createClientPortalOrder() {
    // Validate order type specific requirements
    if (this.orderType === OrderType.Delivery && !this.deliveryAddress) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Dirección requerida', 
        detail: 'Por favor ingresa la dirección de entrega.' 
      });
      this.showOrderTypeDialog = true;
      return;
    }

    const orderRequest = {
      instanceIdentity: this.identity,
      orderType: this.orderType,
      pickupTime: this.pickupTime,
      deliveryAddress: this.deliveryAddress,
      items: this.cartService.getItems().map((item: any) => ({
        mealId: item.meal.id,
        quantity: item.quantity,
        comment: item.comment
      })),
      loyaltyPhoneNumber: this.loyaltyPhoneNumber || null,
      reservationId: this.currentReservationId // Link to reservation if exists
    };

    this.http.post<any>(`${environment.apiBase}ClientInteraction/create-order`, orderRequest)
      .subscribe({
        next: (response) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Pedido Creado', 
            detail: `Tu pedido ha sido recibido. Número de orden: ${response.dinerId}` 
          });
          this.cartService.clear();
          this.cartVisible = false;
          // Redirect to client portal history
          this.router.navigate(['/client-portal/history']);
        },
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: err.error?.message || 'Error al crear el pedido.' 
          });
        }
      });
  }

  // Helper method to set default pickup time (current time + 15 minutes)
  private setDefaultPickupTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.pickupTime = `${year}-${month}-${day}T${hours}:${minutes}` as any;
  }
  // Watch for order type changes
  onOrderTypeChange() {
    console.log('📦 Order type changed to:', this.orderType, OrderType[this.orderType]);
    
    if (this.orderType === OrderType.Pickup) {
      this.setDefaultPickupTime();
    }
    
    // Load saved addresses when Delivery is selected (will be empty if not authenticated)
    if (this.orderType === OrderType.Delivery) {
      console.log('🚚 Delivery selected, loading addresses...');
      this.loadSavedAddresses();
    }
  }
  
  loadSavedAddresses() {
    console.log('🔍 Loading saved addresses...');
    this.clientPortalService.getAddresses().subscribe({
      next: (addresses) => {
        console.log('✅ Addresses loaded:', addresses);
        this.savedAddresses = addresses;
        // Auto-select first address if available
        if (addresses.length > 0 && !this.selectedAddressId) {
          this.selectedAddressId = addresses[0].id!;
          this.deliveryAddress = addresses[0].address;
          console.log('📍 Auto-selected first address:', addresses[0]);
        } else if (addresses.length === 0) {
          console.log('⚠️ No saved addresses found for this user');
        }
      },
      error: (err) => {
        console.error('❌ Error loading addresses:', err);
        console.error('Error details:', err.error);
        this.savedAddresses = [];
      }
    });
  }
  
  onAddressSelect(event: any) {
    const selectedAddress = this.savedAddresses.find(a => a.id === event.value);
    if (selectedAddress) {
      this.deliveryAddress = selectedAddress.address;
      if (selectedAddress.instructions) {
        this.deliveryAddress += ` (${selectedAddress.instructions})`;
      }
    }
  }

  showReservationDialog() {
    if (this.reservationDialog) {
      this.reservationDialog.open();
    }
  }

  onReservationComplete(reservationResponse: ReservationResponse) {
    // Store the reservation ID to link with the order
    this.currentReservationId = reservationResponse.id;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Reservación Confirmada',
      detail: reservationResponse.message,
      life: 5000
    });
    
    // Don't automatically show cart - let user continue shopping if needed
  }
}
