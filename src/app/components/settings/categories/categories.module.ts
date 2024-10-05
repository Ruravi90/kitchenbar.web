import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { SharedModule } from '../../../share.module';

@NgModule({
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        SharedModule
    ],
    declarations: [CategoriesComponent]
})
export class CategoriesModule { }