import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { TablesRoutingModule } from './table-routing.module';
import { TablesComponent } from './tables.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        TablesRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ToastModule
    ],
    declarations: [TablesComponent]
})
export class TablesModule { }