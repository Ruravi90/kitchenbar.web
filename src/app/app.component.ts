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

  permission = signal<NotificationPermission>("default");
  notificationService = inject(WebNotificationService)

//"publicKey":"BGCRL5HzYcj1d9_XThOzy78j278TqvKRO_Qa08vR7BEDkTQt9x2yxXYQdKJbjRNyFV53JNq7pMx6naT8RwPbum4","privateKey":"jxxp74J725RLgbOQP1LCZrtAeHgCDku0hUq29Jo-e4M"
  constructor(
    private primengConfig: PrimeNGConfig,
    private notifiacionsService:NotificationsInterface,
    private updates: AppUpdateService,
    private swPush: SwPush) {
    localStorage.removeItem('userSwPush');
    this.updates.checkForUpdate();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.enableNotify();
    this.onEventNotifications();
  }

  async enableNotify()  {

    if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				console.log("requestPermission",permission);
			});
		} else {
			console.error("This browser does not support notifications.");
		}

    if (this.swPush.isEnabled) {
      try {
        if (Notification.permission != 'granted') {
          this.requestSubscription();
        } else {
          this.requestSubscription();
        }
      } catch (error: any) {
        alert('No se estableció los permisos para notificar');
        console.error(error.message);
      }
    } else {
      console.error("El service worker no ha sido cargado");
    }
  }

  unsubscribe() {
    if (this.swPush.isEnabled && Notification.permission == 'granted')
      this.swPush.unsubscribe();
  }

  getToken() {
    if (this.swPush.isEnabled && Notification.permission == 'granted')
      this.swPush.subscription.subscribe((subscription) => {
        console.log(subscription);
      });
  }

  private async requestSubscription() {
    const payload = await this.swPush.requestSubscription({ serverPublicKey: environment.publicKey });
    console.log(payload.toJSON());
    this.onEventNotifications();
    //? Hacer petición para guardar token en el backend
  }

  private onEventNotifications() {
    if (this.swPush.isEnabled && Notification.permission == 'granted') {

      this.swPush.notificationClicks.subscribe((data) => {

        console.log(data);
      })

      this.swPush.messages.subscribe((message: any) => {
        console.log(message);
        // console.log(message.notification.data.message);
      });
    }
  }


}
