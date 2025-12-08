import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LicensesComponent } from './licenses.component';
import { LicenseFormComponent } from './license-form/license-form.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LicensesComponent },
        { path: 'new', component: LicenseFormComponent },
        { path: 'edit/:id', component: LicenseFormComponent }
    ])],
    exports: [RouterModule]
})
export class LicensesRoutingModule { }
