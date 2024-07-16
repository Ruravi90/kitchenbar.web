import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableComponent } from './table.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TableComponent }
    ])],
    exports: [RouterModule]
})
export class TableRoutingModule { }
