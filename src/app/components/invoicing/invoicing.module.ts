import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicingComponent } from './invoicing.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    InvoicingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    RouterModule.forChild([
      { path: '', component: InvoicingComponent }
    ])
  ]
})
export class InvoicingModule { }
