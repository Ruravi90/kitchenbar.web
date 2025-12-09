import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantConfigComponent } from './restaurant-config.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    RestaurantConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: RestaurantConfigComponent }]),
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    InputNumberModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    DividerModule
  ],
  providers: [MessageService]
})
export class RestaurantConfigModule { }
