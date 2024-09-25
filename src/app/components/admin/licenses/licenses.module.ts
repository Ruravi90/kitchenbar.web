import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { LicensesRoutingModule } from './licenses-routing.module';
import { LicensesComponent } from './licenses.component';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';


@NgModule({
    imports: [
        CommonModule,
        LicensesRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        DataViewModule,
        CardModule
    ],
    declarations: [LicensesComponent]
})
export class LicensesModule { }