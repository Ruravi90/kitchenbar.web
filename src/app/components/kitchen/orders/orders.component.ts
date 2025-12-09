import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../../models';
import { HubInterface, OrdersInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-tables',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [ConfirmationService]
})
export class OrdersComponent implements OnInit{

  private user?:any;
  public coments?:string;
  
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _serviceOrder: OrdersInterface, 
    private hub: HubInterface
  ){
    
  }

  items?: Order[];
  kitchenItems: Order[] = [];
  barItems: Order[] = [];
  expoItems: { tableId: number, tableName: string, items: Order[], createdAt: Date | string }[] = [];
  historyItems: Order[] = [];

  async ngOnInit() {
    this.retrieveOrders();

    this.hub.receiveOrderToKitchen().subscribe(x =>  {
      this.retrieveOrders();
    });
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  retrieveOrders(): void {
    this._serviceOrder.getItemsAllPerDay().subscribe({
      next: (data) => {
        this.items = data;
        
        // Filter active orders (Status 1 or 2)
        const activeOrders = data.filter((i) => !i.isCancel && (i.statusOrderId == 1 || i.statusOrderId == 2));
        
        // Separate Kitchen vs Bar
        this.kitchenItems = activeOrders.filter(i => !i.meal?.category?.isDrink);
        this.barItems = activeOrders.filter(i => i.meal?.category?.isDrink);

        // Group for Expo
        this.groupOrdersByTable(activeOrders);

        // History (Completed orders)
        this.historyItems = data.filter(i => !i.isCancel && i.statusOrderId == 3).sort((a, b) => {
            const timeA = new Date(a.createdAt!).getTime();
            const timeB = new Date(b.createdAt!).getTime();
            return timeB - timeA;
        });
      },
      error: (e) => {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }

  groupOrdersByTable(orders: Order[]) {
    const groups: { [key: number]: { tableId: number, tableName: string, items: Order[], createdAt: Date | string } } = {};
    
    orders.forEach(order => {
        if (!order.tableId) return;
        
        if (!groups[order.tableId]) {
            groups[order.tableId] = {
                tableId: order.tableId,
                tableName: order.table?.name || 'Mesa ?',
                items: [],
                createdAt: order.createdAt!
            };
        }
        groups[order.tableId].items.push(order);
        
        // Use oldest time for the ticket
        const currentGroupTime = new Date(groups[order.tableId].createdAt).getTime();
        const orderTime = new Date(order.createdAt!).getTime();

        if (orderTime < currentGroupTime) {
             groups[order.tableId].createdAt = order.createdAt!;
        }
    });

    this.expoItems = Object.values(groups).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getElapsedTime(dateInput: string | Date | undefined): string {
    if (!dateInput) return '00:00';
    const start = new Date(dateInput).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getSeverity(dateInput: string | Date | undefined): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    if (!dateInput) return 'success';
    const start = new Date(dateInput).getTime();
    const now = new Date().getTime();
    const diff = (now - start) / 60000; // minutes

    if (diff > 20) return 'danger';
    if (diff > 10) return 'warning';
    return 'success';
  }

  changeStatusOrder(event: Event, order:Order, statusId:number){
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "",
        header: statusId==2?'Se inicio con la preparacion?':'Se envio el alimento?',
        accept: () => {
          order.statusOrderId = statusId;
          this._serviceOrder.updateItem(order.id!,order).subscribe({
            next: (data) => {
              this.hub.sendOrder(order);
            },
            error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
          });
        }
    });
  }

  toggleComents(event: Event,op: OverlayPanel, order:Order){
    this.coments = order.aditional;
    op.toggle(event);
  }

}
