import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { InstancesRoutingModule } from './instances-routing.module';
import { InstancesComponent } from './instances.component';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';

@NgModule({
    imports: [
        CommonModule,
        InstancesRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        DataViewModule,
        CardModule
    ],
    declarations: [InstancesComponent]
})
export class InstancesModule { }