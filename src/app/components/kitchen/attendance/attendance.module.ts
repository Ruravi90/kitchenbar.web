import { NgModule } from '@angular/core';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { SharedModule } from '../../../share.module';


@NgModule({
    declarations: [
        AttendanceComponent
    ],
    imports: [
        AttendanceRoutingModule,
        SharedModule,

    ]
})
export class AttendaceModule { }