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
                ]
            },
            { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/landing' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
