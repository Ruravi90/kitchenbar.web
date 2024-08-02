import { Component } from '@angular/core';
import { Order, User } from '../../../models';
import { AuthInterface, HubInterface, OrdersInterface } from '../../../interfaces';

@Component({
  selector: 'app-tables',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  public joined = false;
  private user?:any;
  
  constructor(private _services: OrdersInterface, private auth: AuthInterface, private hubOrder: HubInterface){

    this.hubOrder.connect();
  }

  items?: Order[];

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
    this.retrieveTables();

    this.hubOrder.newUser().subscribe(x => this.joined = true );

    this.hubOrder.leftUser().subscribe(x => this.joined = false);

    this.hubOrder.receiveOrderToKitchen().subscribe(x =>  {
        this._services.getItemWithIncludes(x.id!).subscribe({
          next: (data) => {
            this.items?.push(data);
          },
          error: (e) => console.error(e)
        });
    });
  }

  retrieveTables(): void {
    this._services.getItemsByInstance().subscribe({
      next: (data) => {
        this.items = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

}
