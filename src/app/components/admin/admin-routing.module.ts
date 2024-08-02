import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'instances', loadChildren: () => import('../admin/instances/instances.module').then(m => m.InstancesModule) },
        { path: 'licenses', loadChildren: () => import('../admin/licenses/licenses.module').then(m => m.LicensesModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
