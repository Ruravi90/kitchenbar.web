
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Diner, Meal, Order, Table } from '../../../models';
import { AuthInterface, DinersInterface, HubInterface, MealsInterface, OrdersInterface, TablesInterface } from '../../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-attendace',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit, OnDestroy {

  skeleton :boolean = true;
  items:Order[] = [];
  order:Order = {};
  isLogin:boolean=false;
  totalOrder:number = 0;
  isRequestAttendace:boolean = false;
  isRequestCheck:boolean = false;
  isTableNotBusy:boolean = true;
  table?:Table;
  diners: Diner[] = [];
  dinerForm: Diner = {};
  diner:Diner =  {
    name_client : "Cliente anónimo"
  };
  selectedItem?:Meal;
  suggestionsMeal:Meal[] =[];
  meals:Meal[] = [];
  tableIdentity : string = "";
  instanceIdentity : string = "";
  showModalDiner:boolean = false;

  // Stripe Properties
  showPaymentModal: boolean = false;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentElement: StripePaymentElement | null = null;
  paying: boolean = false;


  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _serviceAuth: AuthInterface,
    private _serviceTable: TablesInterface,
    private _serviceOrder: OrdersInterface,
    private _serviceDiner: DinersInterface,
    private _serviceMeal: MealsInterface,
    private route: ActivatedRoute,
    private router: Router,
    private hub: HubInterface,
    private http: HttpClient,
    private cdr: ChangeDetectorRef){

    this.isLogin = _serviceAuth.checkLogin();

  }

  async ngOnInit() {
    this.order.quantity = 1;
    this.order.statusOrderId = 1;

    await this.delay(1000);
    this.tableIdentity = this.route.snapshot.paramMap.get('identity')!;

    if(!this.isLogin){
      this.hub.connect();
      await this.delay(1000);
      this.hub.newUser().subscribe();
    }

    await this.delay(1000);
    this.getTable();
    this.getDiner();

    if(this.isLogin)
      this.getMeals();

    this.hub.receiveOrderFromTable().subscribe(x =>  {
      this.getDiner();
    });

    this.hub.notificationWarnTables().subscribe(x =>  {
      if(x.id == this.table!.id){
        if(x.isRequestAttendace)
          this.table!.isRequestAttendace = x.isRequestAttendace;
        if(x.isRequestCheck)
          this.table!.isRequestCheck = x.isRequestCheck;
      }
    });
  }
  ngOnDestroy(): void {
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  getInstanceIdentity(): string | undefined {
    debugger;
    if (this.instanceIdentity) return this.instanceIdentity;
    if (this.table && this.table.instance && this.table.instance.identity) return this.table.instance.identity;
    return undefined;
  }

  getTable(){
    this._serviceTable.getByIdentity(this.tableIdentity).subscribe({
      next: (data) => {
        console.log(data);
        this.table = data;
        this.instanceIdentity = data.instance.identity;

        if(!this.isLogin)
          this.hub.joinGroupAnonymus(data.instance.identity);
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  getOrders(){
    this.totalOrder =0;
    this._serviceOrder.getItemsByTable(this.diner.id!).subscribe({
      next: (data) => {
        this.items = data;
        this.items.forEach(i=>{
          if(!i.isCancel)
            this.totalOrder += (i.meal!.price * i.quantity!);
        });
        this.skeleton = false;
        this.isTableNotBusy = false;
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  getDiner(){
    this._serviceDiner.getItemsByTable(this.tableIdentity).subscribe({
      next: (data: any) => {
        if((data == null || data.length == 0) && this.isLogin){
            this.showModalDiner = true;
            this.isTableNotBusy = false;
            this.skeleton = false;
            this.diners = [];
        }
        else{
          if(data != null && data.length > 0){
            this.isTableNotBusy = false;
            this.diners = data;
            
            if (this.diner && this.diner.id) {
                const found = this.diners.find(d => d.id === this.diner.id);
                if (found) {
                    this.diner = found;
                } else {
                    this.diner = this.diners[0];
                }
            } else {
                this.diner = this.diners[0];
            }

            this.order.dinerId = this.diner.id;
            this.getOrders();
          }
          else{
            this.isTableNotBusy = true;
            this.skeleton = true;
            this.diners = [];
          }
        }
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  getMeals(){
    this._serviceMeal.getItemsByInstance().subscribe({
      next: (data) => {
        this.meals = data;
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  requestAttendace(){
    this.table!.isRequestCheck = false;
    this.table!.isRequestAttendace = !this.table!.isRequestAttendace;
    this._serviceTable.request(this.table!).subscribe({
      next:()=>{ this.hub.sendNotificationTables(this.table!)},
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  requestCheck(){
    this.table!.isRequestCheck = !this.table!.isRequestCheck;
    this.table!.isRequestAttendace = false;
    this._serviceTable.request(this.table!).subscribe({
      next:()=>{ this.hub.sendNotificationTables(this.table!)},
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  focusSearchMeal(event:any){
    //this.getMeals();
  }
  searchMeal(event:any){
    let filtered : Meal[]= [];
    let query = event.query;
    for (let i = 0; i < this.meals.length; i++) {
      let meal = this.meals[i];
      if (meal.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(meal);
      }
    }
    this.suggestionsMeal = filtered;
  }
  completeSelectMeal(event:any){
    this.order = {
      mealId: event.value.id,
      tableId: this.table?.id,
      statusOrderId:1,
      quantity: 1
    }
  }
  addOrder(){
    if(!this.selectedItem)
      return;
    this.order.dinerId = this.diner.id;
    this._serviceOrder.createItem(this.order!).subscribe({
      next: (data) => {
        this.hub.sendOrder(this.diner, this.instanceIdentity);
        this.order = {};
        this.order.quantity = 1;
        this.selectedItem=undefined;
        this.getOrders();
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  cancelOrder(order:Order){
    order.isCancel = true;
    this._serviceOrder.updateItem(order.id!,order).subscribe({
      next: (data) => {
        this.hub.sendOrder(this.diner, this.instanceIdentity);
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  confirmCancel(order:Order) {
    this.confirmationService.confirm({
        header: 'Estas seguro de cancelar?',
        message: 'Por favor de confirmar.',
        accept: () => {
          this.cancelOrder(order);
        }
    });
  }
  changeStatusOrder(event: Event, order:Order){
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "",
        header: 'Se entrego el alimento?',
        accept: () => {
          order.statusOrderId = 4;
          this._serviceOrder.updateItem(order.id!,order).subscribe({
            next: (data) => {
              this.hub.sendOrder(this.diner, this.instanceIdentity);
            },
            error: (e) => {
              console.log(e);
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
          });
        }
    });
  }
  hasPendingOrders(): boolean {
    // Status < 4 means it is not yet delivered (Pending, Processing, Preparing, OnTheWay)
    // We also check !isCancel to only count active orders
    return this.items.some(item => item.statusOrderId! < 4 && !item.isCancel);
  }

  confirmCloseTicket() {
    if (this.hasPendingOrders()) {
      this.confirmationService.confirm({
        header: 'Órdenes Pendientes',
        message: 'Hay órdenes en preparación o sin entregar. ¿Deseas cancelarlas para cerrar la cuenta?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, cancelar y cerrar',
        rejectLabel: 'No',
        accept: () => {
          this.cancelPendingOrdersAndClose();
        }
      });
    } else {
      this.confirmationService.confirm({
        header: '¿Estás seguro de cerrar la cuenta?',
        message: 'Por favor confirmar.',
        accept: () => {
          this.closeTicket();
        }
      });
    }
  }

  cancelPendingOrdersAndClose() {
    const pendingOrders = this.items.filter(item => item.statusOrderId! < 4 && !item.isCancel);
    const cancelObservables = pendingOrders.map(order => {
      order.isCancel = true;
      return this._serviceOrder.updateItem(order.id!, order);
    });

    if (cancelObservables.length > 0) {
      forkJoin(cancelObservables).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Órdenes pendientes canceladas.' });
          this.hub.sendOrder(this.diner, this.instanceIdentity); // Notify updates
          this.closeTicket();
        },
        error: (e) => {
          console.error(e);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cancelar órdenes.' });
        }
      });
    } else {
      this.closeTicket();
    }
  }

  closeTicket() {
    this._serviceDiner.closeTicket(this.diner.id!).subscribe({
      next: (data) => {
        this.hub.sendOrder(this.diner, this.instanceIdentity);
        this.getDiner();
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.error });
      }
    });
  }
  saveDiner(){
    if(this.table == null)
      return;

    this.dinerForm.tableId = this.table.id;
    this._serviceDiner.createItem(this.dinerForm).subscribe({
      next: (data) => {
        console.log("Diner --> ",data);
        this.diner = data;
        this.order = {};
        this.order.quantity = 1;
        this.showModalDiner = false;
        this.dinerForm = {};
        this.hub.sendOrder(this.diner, this.instanceIdentity);
        this.getDiner();
      },
      error: (e) => {
        this.showModalDiner = true;
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.error });
      }
    });
  }

  changeDiner(diner: Diner) {
    this.diner = diner;
    this.order.dinerId = diner.id;
    this.getOrders();
  }

  goToMenu() {
    if (this.instanceIdentity) {
      this.router.navigate(['/menu', this.instanceIdentity], {
        queryParams: {
          tableId: this.table?.id,
          tableIdentity: this.tableIdentity,
          dinerId: this.diner?.id
        }
      });
    }
  }

  openNewDinerModal() {
    this.dinerForm = {};
    this.showModalDiner = true;
  }

  async payOnline() {
    if (!this.diner || !this.diner.id) return;

    if (this.hasPendingOrders()) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Órdenes Pendientes', 
        detail: 'No puedes pagar mientras haya órdenes en preparación. Por favor solicita a tu mesero que las cancele o espere a que sean entregadas.' 
      });
      return;
    }
    
    this.paying = true;
    
    // Initialize Stripe if not already done
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublicKey);
    }

    this.http.post<any>(`${environment.apiBase}Payments/create-payment-intent-diner`, { dinerId: this.diner.id })
      .subscribe({
        next: async (res) => {
          console.log('Client Secret Response:', res);
          if (res.clientSecret) {
              this.showPaymentModal = true;
              this.cdr.detectChanges(); // Ensure modal is in DOM

              if (this.stripe) {
                this.elements = this.stripe.elements({ 
                  clientSecret: res.clientSecret,
                  appearance: { theme: 'stripe' },
                  locale: 'es'
                });

                this.paymentElement = this.elements.create('payment', { layout: 'tabs' });
                this.paymentElement.mount('#payment-element');
              }
          } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de configuración de pagos.' });
          }
          this.paying = false;
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo iniciar el pago.' });
          this.paying = false;
        }
      });
  }

  async confirmPayment() {
    if (this.paying || !this.stripe || !this.elements) return;
    this.paying = true;

    const result = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required'
    });

    this.paying = false;

    if (result.error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: result.error.message });
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      
      // Call backend to confirm payment and close ticket securely
      this.http.post<any>(`${environment.apiBase}Payments/confirm-diner-payment`, { paymentIntentId: result.paymentIntent.id })
        .subscribe({
          next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Pago Exitoso', detail: 'Tu cuenta ha sido pagada y cerrada.' });
            this.showPaymentModal = false;
            this.hub.sendOrder(this.diner, this.instanceIdentity);
            this.getDiner();
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pago exitoso pero error al cerrar ticket. Contacta al mesero.' });
          }
        });
    }
  }
}
