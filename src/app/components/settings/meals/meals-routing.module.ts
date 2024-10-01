import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MealsComponent } from './meals.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MealsComponent }
    ])],
    exports: [RouterModule]
})
export class MealsRoutingModule { }
