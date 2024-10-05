import { NgModule } from '@angular/core';
import { TablesRoutingModule } from './table-routing.module';
import { TablesComponent } from './tables.component';
import { SharedModule } from '../../../share.module';

@NgModule({
    imports: [
        TablesRoutingModule,
        SharedModule
    ],
    declarations: [TablesComponent]
})
export class TablesModule { }