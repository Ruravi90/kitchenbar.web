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

        // History (Completed orders)
        this.historyItems = data.filter(i => !i.isCancel && i.statusOrderId == 3).sort((a, b) => {
            return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        });
      },
      error: (e) => {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }

  getElapsedTime(dateString: string): string {
    if (!dateString) return '00:00';
    const start = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getSeverity(dateString: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    if (!dateString) return 'success';
    const start = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = (now - start) / 60000; // minutes

    if (diff > 15) return 'danger';
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
