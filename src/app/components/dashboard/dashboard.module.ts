import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
