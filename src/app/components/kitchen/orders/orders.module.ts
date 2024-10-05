import { NgModule } from '@angular/core';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { SharedModule } from '../../../share.module';
@NgModule({
    imports: [
        OrdersRoutingModule,
        SharedModule
    ],
    declarations: [OrdersComponent]
})
export class OrdersModule { }