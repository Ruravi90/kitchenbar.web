import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LicensesComponent } from './licenses.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LicensesComponent }
    ])],
    exports: [RouterModule]
})
export class LicensesRoutingModule { }
