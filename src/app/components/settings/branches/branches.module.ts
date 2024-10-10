import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchesRoutingModule } from './branches-routing.module';
import { BranchesComponent } from './branches.component';
import { SharedModule } from '../../../share.module';

@NgModule({
    imports: [
        CommonModule,
        BranchesRoutingModule,
        SharedModule
    ],
    declarations: [BranchesComponent]
})
export class BranchesModule { } 