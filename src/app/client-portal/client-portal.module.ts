import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientPortalRoutingModule } from './client-portal-routing.module';
import { ClientLoginComponent } from './pages/client-login.component';
import { ClientProfileComponent } from './pages/client-profile.component';
import { ClientHistoryComponent } from './pages/client-history.component';
import { ClientFavoritesComponent } from './pages/client-favorites.component';
import { LinkBranchComponent } from './pages/link-branch.component';
import { CheckinTableComponent } from './pages/checkin-table.component';
import { QrScannerComponent } from '../shared/components/qr-scanner/qr-scanner.component';
import { SharedModule } from '../share.module';



@NgModule({
  declarations: [
    LinkBranchComponent,
    CheckinTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientPortalRoutingModule,
    ClientLoginComponent,
    ClientProfileComponent,
    ClientHistoryComponent,
    ClientFavoritesComponent,
    QrScannerComponent
  ]
})

export class ClientPortalModule { }
