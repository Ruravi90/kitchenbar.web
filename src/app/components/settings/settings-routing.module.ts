import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'account', loadChildren: () => import('../settings/account/account.module').then(m => m.AccountModule) },
        { path: 'tables', loadChildren: () => import('../settings/tables/tables.module').then(m => m.TablesModule) },
        { path: 'categories', loadChildren: () => import('../settings/categories/categories.module').then(m => m.CategoriesModule) },
        { path: 'users', loadChildren: () => import('../settings/users/users.module').then(m => m.UsersModule) },
        { path: 'meals', loadChildren: () => import('../settings/meals/meals.module').then(m => m.MealsModule) },
        { path: 'branches', loadChildren: () => import('../settings/branches/branches.module').then(m => m.BranchesModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
