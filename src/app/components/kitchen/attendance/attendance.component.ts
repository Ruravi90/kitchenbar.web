import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Diner, Meal, Order, Table } from '../../../models';
import { AuthInterface, DinersInterface, HubInterface, MealsInterface, OrdersInterface, TablesInterface } from '../../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StripeService, StripePaymentElementComponent, StripeElementsDirective } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions, StripeElements } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
  elementsOptions: StripeElementsOptions = {
    locale: 'es',
    appearance: {
      theme: 'stripe'
    }
  };
  paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs'
  };
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
    private stripeService: StripeService,
    private http: HttpClient){

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
        this.hub.sendOrder(this.diner);
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
        this.hub.sendOrder(this.diner);
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
              this.hub.sendOrder(this.diner);
            },
            error: (e) => {
              console.log(e);
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
          });
        }
    });
  }
  confirmCloseTicket(){
    this.confirmationService.confirm({
      header: 'Estas seguro de cerrar la cuenta?',
      message: 'Por favor de confirmar.',
      accept: () => {
        this._serviceDiner.closeTicket(this.diner.id!).subscribe({
          next: (data) => {
            this.hub.sendOrder(this.diner);
            this.getDiner();
            //this.router.navigate(['/kitchen/tables']);
          },
          error: (e) => {
            console.log(e);
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.error });
          }
        });
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
        this.hub.sendOrder(this.diner);
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

  payOnline() {
    if (!this.diner || !this.diner.id) return;
    
    this.paying = true;
    this.http.post<any>(`${environment.apiBase}Payments/create-payment-intent-diner`, { dinerId: this.diner.id })
      .subscribe({
        next: (res) => {
          console.log('Client Secret Response:', res);
          if (res.clientSecret && !res.clientSecret.includes('{{')) {
              this.elementsOptions.clientSecret = res.clientSecret;
              this.showPaymentModal = true;
          } else {
              console.error('Invalid Client Secret:', res.clientSecret);
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

  @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;
  elements!: StripeElements;

  confirmPayment() {
    if (this.paying) return;
    this.paying = true;

    this.stripeService.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: window.location.href, // Or specific success page
      },
      redirect: 'if_required'
    }).subscribe(result => {
      this.paying = false;
      if (result.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: result.error.message });
      } else {
        if (result.paymentIntent.status === 'succeeded') {
            this.messageService.add({ severity: 'success', summary: 'Pago Exitoso', detail: 'Tu cuenta ha sido pagada.' });
            this.showPaymentModal = false;
            // Close ticket in backend
            this._serviceDiner.closeTicket(this.diner.id!).subscribe(() => {
                this.getDiner(); // Reload status
            });
        }
      }
    });
  }
}
