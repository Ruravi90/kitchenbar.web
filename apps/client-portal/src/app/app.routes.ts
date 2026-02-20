import { Route } from '@angular/router';
import { ClientLoginComponent } from './pages/client-login.component';
import { ClientProfileComponent } from './pages/client-profile.component';
import { ClientHistoryComponent } from './pages/client-history.component';
import { ClientFavoritesComponent } from './pages/client-favorites.component';
import { LinkBranchComponent } from './pages/link-branch.component';
import { CheckinTableComponent } from './pages/checkin-table.component';
import { clientAuthGuard } from '@kitchenbar/shared-data-access';

export const appRoutes: Route[] = [
  {
    path: 'client-portal',
    children: [
      { path: 'login', component: ClientLoginComponent },
      { path: 'profile', component: ClientProfileComponent, canActivate: [clientAuthGuard] },
      { path: 'history', component: ClientHistoryComponent, canActivate: [clientAuthGuard] },
      { path: 'favorites', component: ClientFavoritesComponent, canActivate: [clientAuthGuard] },
      { path: 'link-branch/:branchIdentity', component: LinkBranchComponent },
      { path: 'link-branch', component: LinkBranchComponent },
      { path: 'checkin-table/:tableIdentity', component: CheckinTableComponent },
      { path: 'checkin-table', component: CheckinTableComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'client-portal', pathMatch: 'full' },
  { path: '**', redirectTo: 'client-portal' }
];
