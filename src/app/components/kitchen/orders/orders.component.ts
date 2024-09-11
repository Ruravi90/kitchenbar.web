import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order, User } from '../../../models';
import { HubInterface, OrdersInterface } from '../../../interfaces';

@Component({
  selector: 'app-tables',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{

  
  private user?:any;
  
  constructor(private _services: OrdersInterface, private hub: HubInterface){
    
  }

  items?: Order[];

  async ngOnInit() {
    this.retrieveTables();

    this.hub.receiveOrderToKitchen().subscribe(x =>  {
        this._services.getItemWithIncludes(x.id!).subscribe({
          next: (data) => {
            this.items?.push(data);
          },
          error: (e) => console.error(e)
        });
    });
  }



  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  retrieveTables(): void {
    this._services.getItemsByInstance().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (e) => console.error(e)
    });
  }

}
