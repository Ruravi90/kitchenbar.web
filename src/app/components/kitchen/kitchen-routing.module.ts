import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'tables', loadChildren: () => import('../kitchen/tables/tables.module').then(m => m.TablesModule) },
        { path: 'table/:tableIdentity', loadChildren: () => import('../kitchen/table/table.module').then(m => m.TableModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class KitchenRoutingModule { }
