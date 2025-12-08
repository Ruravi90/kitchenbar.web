import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PackageListComponent } from './packages/package-list/package-list.component';
import { PackageFormComponent } from './packages/package-form/package-form.component';
import { PromotionListComponent } from './promotions/promotion-list/promotion-list.component';
import { PromotionFormComponent } from './promotions/promotion-form/promotion-form.component';
import { MembershipListComponent } from './memberships/membership-list/membership-list.component';
import { MembershipDetailComponent } from './memberships/membership-detail/membership-detail.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'instances', loadChildren: () => import('../admin/instances/instances.module').then(m => m.InstancesModule) },
        { path: 'licenses', loadChildren: () => import('../admin/licenses/licenses.module').then(m => m.LicensesModule) },
        { path: 'packages', component: PackageListComponent },
        { path: 'packages/new', component: PackageFormComponent },
        { path: 'packages/edit/:id', component: PackageFormComponent },
        { path: 'promotions', component: PromotionListComponent },
        { path: 'promotions/new', component: PromotionFormComponent },
        { path: 'promotions/edit/:id', component: PromotionFormComponent },
        { path: 'memberships', component: MembershipListComponent },
        { path: 'memberships/:id', component: MembershipDetailComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
