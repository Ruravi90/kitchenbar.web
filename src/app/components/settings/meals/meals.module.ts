import { NgModule } from '@angular/core';
import { MealsRoutingModule } from './meals-routing.module';
import { MealsComponent } from './meals.component';
import { SharedModule } from '../../../share.module';

@NgModule({
    imports: [
        MealsRoutingModule,
        SharedModule
    ],
    declarations: [MealsComponent]
})
export class MealsModule { }