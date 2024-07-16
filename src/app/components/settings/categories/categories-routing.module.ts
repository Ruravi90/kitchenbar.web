import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from '../../settings/categories/categories.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CategoriesComponent }
    ])],
    exports: [RouterModule]
})
export class CategoriesRoutingModule { }
