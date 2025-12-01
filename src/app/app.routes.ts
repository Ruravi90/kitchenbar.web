import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { canActivateChild } from './utilities/AlwaysAuthGuard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '',canActivate: [canActivateChild],loadChildren: () => import('./components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'kitchen',canActivate: [canActivateChild],loadChildren: () => import('./components/kitchen/kitchen.module').then(m => m.KitchenModule) },
                    { path: 'settings',canActivate: [canActivateChild],loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule) },
                    { path: 'admin',canActivate: [canActivateChild],loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },
                    { path: 'client/:identity', loadChildren: () => import('../app/components/kitchen/attendance/attendance.module').then(m => m.AttendaceModule) },
                    { path: 'menu/:identity', loadChildren: () => import('../app/components/menu/menu.module').then(m => m.MenuModule) },
                    { path: 'inventory-prediction', loadComponent: () => import('./components/inventory-prediction/inventory-prediction.component').then(m => m.InventoryPredictionComponent) },
                    { path: 'inventory', loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent) },
                    { path: 'dashboard', canActivate: [canActivateChild], loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'public', loadChildren: () => import('./components/public-menu/public-menu.module').then(m => m.PublicMenuModule) },
                ]
            },
            { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'facturacion', loadChildren: () => import('./components/invoicing/invoicing.module').then(m => m.InvoicingModule) },
            { path: 'landing', loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/landing' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
