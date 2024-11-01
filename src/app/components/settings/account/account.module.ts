import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../../../share.module';

@NgModule({
    imports: [
        CommonModule,
        AccountRoutingModule,
        SharedModule
    ],
    declarations: [AccountComponent]
})
export class AccountModule { }
