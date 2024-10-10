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
        this.items = data.filter((i) => i.isCancel == false && (i.statusOrderId ==1 || i.statusOrderId ==2));
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
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
