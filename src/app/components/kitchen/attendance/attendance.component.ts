import { Component, OnDestroy, OnInit } from '@angular/core';
import { Diner, Meal, Order, Table } from '../../../models';
import { AuthInterface, DinersInterface, HubInterface, MealsInterface, OrdersInterface, TablesInterface } from '../../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-attendace',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit, OnDestroy {

  items:Order[] = [];
  order:Order = {};
  isLogin:boolean=false;
  totalOrder:number = 0;
  isRequestAttendace:boolean = false;
  isRequestCheck:boolean = false;
  table?:Table;
  diner:Diner =  {
    name_client : "Cliente anónimo"
  };
  selectedItem?:Meal;
  suggestionsMeal:Meal[] =[];
  meals:Meal[] = [];
  tableIdentity : string = "";
  instanceIdentity : string = "";
  showModalDiner:boolean = false;

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
    private hub: HubInterface){
    
    this.isLogin = _serviceAuth.checkLogin();

  }

  async ngOnInit() {
    if(!this.isLogin){
      this.hub.connect();
      await this.delay(1000);
      this.hub.newUser().subscribe();
    }
    
    this.order.quantity = 1;
    this.order.statusOrderId = 1;
    this.tableIdentity = this.route.snapshot.paramMap.get('identity')!;
    this.getTable();
    this.getDiner();
    await this.delay(1000);

    this.getOrders();
    
    if(this.isLogin)
      this.getMeals();

    this.hub.receiveOrderFromTable().subscribe(x =>  {
      this.getDiner();
      this.delay(1000);
      this.getOrders();
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
      error: (e) => console.error(e)
    });
  }
  getOrders(){
    this._serviceOrder.getItemsByTable(this.diner.id!).subscribe({
      next: (data) => {
        console.log(data);
        this.items = data;
        this.items.forEach(i=>{
          if(!i.isCancel)
            this.totalOrder += (i.meal!.price * i.quantity!);
        });
      },
      error: (e) => console.error(e)
    });
  }
  getDiner(){
    this._serviceDiner.getItemsByTable(this.tableIdentity).subscribe({
      next: (data) => {
        if(data == null && this.isLogin){
            this.showModalDiner = true;
        }
        else
          this.diner = data;
      },
      error: (e) => console.error(e)
    });
  }
  getMeals(){
    this._serviceMeal.getByInstanceIdentity(this.table?.instance?.identity!).subscribe({
      next: (data) => {
        console.log("suggestionsMeal", data);
        this.meals = data;
      },
      error: (e) => console.error(e)
    });
  }
  requestAttendace(){
    this.table!.isRequestCheck = false;
    this.table!.isRequestAttendace = !this.table!.isRequestAttendace;
    this._serviceTable.request(this.table!).subscribe({
      next:()=>{ this.hub.sendNotificationTables(this.table!)},
      error: (e) => console.error(e)
    });
  }
  requestCheck(){
    this.table!.isRequestCheck = !this.table!.isRequestCheck;
    this.table!.isRequestAttendace = false;
    this._serviceTable.request(this.table!).subscribe({
      next:()=>{ this.hub.sendNotificationTables(this.table!)},
      error: (e) => console.error(e)
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
        this.hub.sendOrder(this.order);
        this.order = {};
        this.order.dinerId = this.diner.id;
        this.order.quantity = 1;
        this.selectedItem=undefined;
      },
      error: (e) => console.error(e)
    });
  }
  cancelOrder(order:Order){
    order.isCancel = true;
    this._serviceOrder.updateItem(order.id!,order).subscribe({
      next: (data) => {
        this.hub.sendOrder(order);
      },
      error: (e) => console.error(e)
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
              this.hub.sendOrder(order);
            },
            error: (e) => console.error(e)
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
            this.router.navigate(['/kitchen/tables']);
          },
          error: (e) => {this.showModalDiner = true;}
        });
      }
  });
  }

  saveDiner(){
    if(this.table == null)
      return;

    this.diner.tableId = this.table.id;
    this._serviceDiner.createItem(this.diner).subscribe({
      next: (data) => {
          this.showModalDiner = false;
      },
      error: (e) => {this.showModalDiner = true;}
    });
  }
}
