import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'orders', loadChildren: () => import('../kitchen/orders/orders.module').then(m => m.OrdersModule) },
        { path: 'tables', loadChildren: () => import('../kitchen/tables/tables.module').then(m => m.TablesModule) },
        { path: 'table/:identity', loadChildren: () => import('../kitchen/attendance/attendance.module').then(m => m.AttendaceModule) },
        { path: '**', redirectTo: '/tables' }
    ])],
    exports: [RouterModule]
})
export class KitchenRoutingModule { }
