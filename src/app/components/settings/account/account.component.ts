import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputSwitchChangeEvent } from 'primeng/inputswitch';
import { WebNotificationService } from '../../../utilities/WebNotificationService';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  IsActiveNotification: boolean = false;
  permission = signal<NotificationPermission>("default");
  notificationService = inject(WebNotificationService);
  
  user: User = new User();
  loading: boolean = false;

  //"publicKey":"BGCRL5HzYcj1d9_XThOzy78j278TqvKRO_Qa08vR7BEDkTQt9x2yxXYQdKJbjRNyFV53JNq7pMx6naT8RwPbum4","privateKey":"jxxp74J725RLgbOQP1LCZrtAeHgCDku0hUq29Jo-e4M"

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private swPush: SwPush,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    Notification.requestPermission().then((permission) => {
      if (permission == "granted")
        this.IsActiveNotification = true;
      console.log("requestPermission", permission);
    });

    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    }
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && ((window.navigator as any).standalone);

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      //this.setState({ showInstallMessage: true });
    }
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    // Get basic info from local storage or auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.loading = true;
      // Fetch full details from API to ensure we have the latest
      this.usersService.getItem(currentUser.id).subscribe({
        next: (data) => {
          this.user = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del usuario' });
          this.loading = false;
        }
      });
    }
  }

  saveProfile() {
    if (!this.user.id) return;
    
    this.loading = true;
    this.usersService.updateItem(this.user.id, this.user).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente' });
        this.loading = false;
        // Optionally update local storage if needed
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el perfil' });
        this.loading = false;
      }
    });
  }


  async activeNotification(event: InputSwitchChangeEvent) {
    console.log(event);
    if (event.checked) {
      try {
        Notification.requestPermission().then(permission => {
          if (permission == "granted")
            this.requestSubscription();
          else {
            this.IsActiveNotification = false;
            alert("Su dispositivo no permite las notificaciones de app");
          }

        });
      }
      catch (err) {
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
