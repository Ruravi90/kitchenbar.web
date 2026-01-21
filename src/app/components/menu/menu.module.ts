import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { NgxStripeModule } from 'ngx-stripe';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    MenuComponent,
    ReservationDialogComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    RatingModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    TabViewModule,
    CardModule,
    DialogModule,
    ToastModule,
    NgxStripeModule,
    InputNumberModule,
    InputTextareaModule,
    CalendarModule
  ]
})
export class MenuModule { }
