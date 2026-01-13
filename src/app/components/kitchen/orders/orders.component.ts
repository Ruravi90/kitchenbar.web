import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Order } from '../../../models';
import { HubInterface, OrdersInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tables',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [ConfirmationService]
})
export class OrdersComponent implements OnInit, OnDestroy {

  private user?:any;
  public coments?:string;
  private subscriptions: Subscription[] = [];
  
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _serviceOrder: OrdersInterface, 
    private hub: HubInterface
  ){}

  items?: Order[];
  kitchenItems: Order[] = [];
  barItems: Order[] = [];
  expoItems: { tableId: number, tableName: string, items: Order[], createdAt: Date | string }[] = [];
  historyItems: Order[] = [];

  async ngOnInit() {
    this.retrieveOrders();

    // Subscribe to order updates and store subscription
    const orderSub = this.hub.receiveOrderToKitchen().subscribe(x => {
      this.retrieveOrders();
    });
    this.subscriptions.push(orderSub);
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
        header: statusId==2?'¿Iniciar con la preparación?':'¿Marcar como listo?',
        accept: () => {
          order.statusOrderId = statusId;
          this._serviceOrder.updateItem(order.id!,order).subscribe({
            next: (data) => {
              this.hub.sendOrder(order);
              
              // Show success message
              const statusText = statusId === 2 ? 'en preparación' : 'lista';
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Orden Actualizada', 
                detail: `Orden marcada como ${statusText}` 
              });
              
              // Refresh orders to update Kanban columns
              this.retrieveOrders();
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

  isOnlineOrder(order: Order): boolean {
    return order.table?.name === 'Online Orders';
  }

  cancelOrder(event: Event, order: Order) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "¿Estás seguro que deseas cancelar esta orden? Esta acción no se puede deshacer.",
      header: 'Cancelar Orden Online',
      accept: () => {
        order.isCancel = true;
        this._serviceOrder.updateItem(order.id!, order).subscribe({
          next: (data) => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Orden Cancelada', 
              detail: 'La orden ha sido cancelada exitosamente.' 
            });
            this.retrieveOrders(); // Refresh orders list
          },
          error: (e) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: e.error?.messages || 'Error al cancelar la orden.' 
            });
          }
        });
      }
    });
  }

  // Kanban Helper Methods for Kitchen
  getPendingKitchenOrders(): Order[] {
    return this.kitchenItems.filter(order => order.statusOrderId === 1);
  }

  getInProgressKitchenOrders(): Order[] {
    return this.kitchenItems.filter(order => order.statusOrderId === 2);
  }

  getReadyKitchenOrders(): Order[] {
    return this.kitchenItems.filter(order => order.statusOrderId === 3);
  }

  // Kanban Helper Methods for Bar
  getPendingBarOrders(): Order[] {
    return this.barItems.filter(order => order.statusOrderId === 1);
  }

  getInProgressBarOrders(): Order[] {
    return this.barItems.filter(order => order.statusOrderId === 2);
  }

  getReadyBarOrders(): Order[] {
    return this.barItems.filter(order => order.statusOrderId === 3);
  }

}
