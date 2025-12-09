import { Component, inject, OnInit, signal } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {SwPush, SwUpdate} from '@angular/service-worker';
import { WebNotificationService } from './utilities/WebNotificationService';
import { NotificationsInterface } from './interfaces';
import { AppUpdateService } from "./utilities/AppUpdateService"
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {


  constructor(
    private primengConfig: PrimeNGConfig,
    private notifiacionsService:NotificationsInterface,
    private updates: AppUpdateService) {
    localStorage.removeItem('userSwPush');
    this.updates.checkForUpdate();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }




}
