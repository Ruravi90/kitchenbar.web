import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLoginComponent } from './pages/client-login.component';
import { ClientProfileComponent } from './pages/client-profile.component';
import { ClientHistoryComponent } from './pages/client-history.component';
import { ClientFavoritesComponent } from './pages/client-favorites.component';
import { LinkBranchComponent } from './pages/link-branch.component';
import { CheckinTableComponent } from './pages/checkin-table.component';

const routes: Routes = [
  { path: 'login', component: ClientLoginComponent },
  { path: 'profile', component: ClientProfileComponent },
  { path: 'history', component: ClientHistoryComponent },
  { path: 'favorites', component: ClientFavoritesComponent },
  { path: 'link-branch/:branchIdentity', component: LinkBranchComponent },
  { path: 'link-branch', component: LinkBranchComponent },
  { path: 'checkin-table/:tableIdentity', component: CheckinTableComponent },
  { path: 'checkin-table', component: CheckinTableComponent },
  { path: '', redirectTo: 'profile', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientPortalRoutingModule { }
