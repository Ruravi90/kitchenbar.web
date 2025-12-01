import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublicMenuComponent } from './public-menu.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxStripeModule } from 'ngx-stripe';
import { SharedModule } from '../../share.module';

const routes: Routes = [
  { path: 'menu/:identity', component: PublicMenuComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '', redirectTo: 'menu', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    PublicMenuComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxStripeModule
  ]
})
export class PublicMenuModule { }
