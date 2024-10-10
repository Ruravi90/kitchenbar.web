import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchesComponent } from '../branches/branches.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: BranchesComponent }
    ])],
    exports: [RouterModule]
})
export class BranchesRoutingModule { }
