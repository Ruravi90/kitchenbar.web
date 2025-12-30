import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputSwitchChangeEvent } from 'primeng/inputswitch';
import { WebNotificationService } from '../../../utilities/WebNotificationService';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user.model';
import { WebPushNotificationService } from '../../../services/web-push-notification.service';

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
  checkingSubscription: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private pushService: WebPushNotificationService,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    }
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && ((window.navigator as any).standalone);

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Activar Notificaciones', 
        detail: 'Para recibir notificaciones en iOS, debes agregar esta aplicación a tu pantalla de inicio ("Add to Home Screen").',
        life: 10000 
      });
    }
  }

  async ngOnInit() {
    this.loadUser();
    await this.checkSubscriptionStatus();
  }

  /**
   * Check if user is already subscribed to push notifications
   */
  async checkSubscriptionStatus() {
    try {
      this.checkingSubscription = true;
      this.IsActiveNotification = await this.pushService.isSubscribed();
      this.permission.set(Notification.permission);
      this.checkingSubscription = false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      this.checkingSubscription = false;
    }
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
    console.log('Notification toggle:', event);
    
    if (event.checked) {
      // User wants to enable notifications
      try {
        const subscribed = await this.pushService.subscribe();
        
        if (subscribed) {
          this.IsActiveNotification = true;
          this.permission.set('granted');
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Notificaciones Activadas', 
            detail: 'Recibirás notificaciones sobre pedidos y actualizaciones.' 
          });
        } else {
          this.IsActiveNotification = false;
          this.messageService.add({ 
            severity: 'warn', 
            summary: 'Permiso Denegado', 
            detail: 'No se pudo activar las notificaciones. Verifica los permisos del navegador.' 
          });
        }
      } catch (error) {
        console.error('Error subscribing:', error);
        this.IsActiveNotification = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Ocurrió un error al activar las notificaciones.' 
        });
      }
    } else {
      // User wants to disable notifications
      try {
        const unsubscribed = await this.pushService.unsubscribe();
        
        if (unsubscribed) {
          this.IsActiveNotification = false;
          this.messageService.add({ 
            severity: 'info', 
            summary: 'Notificaciones Desactivadas', 
            detail: 'Ya no recibirás notificaciones push.' 
          });
        }
      } catch (error) {
        console.error('Error unsubscribing:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Ocurrió un error al desactivar las notificaciones.' 
        });
      }
    }
  }

}
