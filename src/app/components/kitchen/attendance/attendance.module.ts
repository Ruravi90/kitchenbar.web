import { NgModule } from '@angular/core';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { SharedModule } from '../../../share.module';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
    declarations: [
        AttendanceComponent
    ],
    imports: [
        AttendanceRoutingModule,
        SharedModule,
        NgxStripeModule
    ]
})
export class AttendaceModule { }