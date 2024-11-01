import { Component, inject, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputSwitchChangeEvent } from 'primeng/inputswitch';
import { WebNotificationService } from '../../../utilities/WebNotificationService';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  IsActiveNotification:boolean = false;
  permission = signal<NotificationPermission>("default");
  notificationService = inject(WebNotificationService);

//"publicKey":"BGCRL5HzYcj1d9_XThOzy78j278TqvKRO_Qa08vR7BEDkTQt9x2yxXYQdKJbjRNyFV53JNq7pMx6naT8RwPbum4","privateKey":"jxxp74J725RLgbOQP1LCZrtAeHgCDku0hUq29Jo-e4M"

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private swPush: SwPush){
      Notification.requestPermission().then((permission) => {
        if(permission == "granted")
          this.IsActiveNotification = true;
				console.log("requestPermission",permission);
			});

      // Detects if device is on iOS
      const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test( userAgent );
      }
      // Detects if device is in standalone mode
      const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

      // Checks if should display install popup notification:
      if (isIos() && !isInStandaloneMode()) {
        //this.setState({ showInstallMessage: true });
      }
    }



  async activeNotification(event : InputSwitchChangeEvent){
    console.log(event);
    if(event.checked){
      try{
        Notification.requestPermission().then(permission => {
          if(permission == "granted")
            this.requestSubscription();
          else{
            this.IsActiveNotification = false;
            alert("Su dispositivo no permite las notificaciones de app");
          }

        });
      }
      catch(err){
        this.IsActiveNotification = false;
      }

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
