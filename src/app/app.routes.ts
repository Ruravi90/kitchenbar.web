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
                canActivate: [canActivateChild],
                children: [
                    { path: '', loadChildren: () => import('./components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'kitchen', loadChildren: () => import('./components/kitchen/kitchen.module').then(m => m.KitchenModule) },
                    { path: 'settings', loadChildren: () => import('./components/settings/settings.module').then(m => m.SettingsModule) },
                    { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },
                ]

            },
            { path: 'client/:identity', loadChildren: () => import('../app/components/kitchen/attendance/attendance.module').then(m => m.AttendaceModule) },
            { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}