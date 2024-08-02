import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InstancesComponent } from './instances.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InstancesComponent }
    ])],
    exports: [RouterModule]
})
export class InstancesRoutingModule { }
