import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AttendanceComponent } from '../../kitchen/attendance/attendance.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AttendanceComponent }
    ])],
    exports: [RouterModule]
})
export class AttendanceRoutingModule { }
