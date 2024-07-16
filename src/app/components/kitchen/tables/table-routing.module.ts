import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablesComponent } from '../../kitchen/tables/tables.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TablesComponent }
    ])],
    exports: [RouterModule]
})
export class TablesRoutingModule { }
