import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientPortalService } from '../../services/client-portal.service';
import { Observable, Subscription } from 'rxjs';
import { ClientNavigationComponent } from '../components/client-navigation/client-navigation.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { HubInterface } from '../../interfaces';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [CommonModule, ClientNavigationComponent, ConfirmDialogModule, ButtonModule, ToastModule],
  templateUrl: './client-history.component.html',
  styleUrls: ['./client-history.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ClientHistoryComponent implements OnInit, OnDestroy {
  orders$: Observable<any[]> | undefined;
  private orderUpdateSubscription?: Subscription;

  constructor(
    private clientService: ClientPortalService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private hub: HubInterface
  ) {}

  async ngOnInit() {
    // Connect to SignalR hub
    this.hub.connect();
    await this.delay(1000); // Wait for connection
    
    // Get instance identity from first order or localStorage
    const clientUser = localStorage.getItem('client_user');
    if (clientUser) {
      const user = JSON.parse(clientUser);
      // Join as anonymous for client portal (no instance needed)
      this.hub.joinGroupAnonymus('client-portal');
    }
    
    this.loadOrders();
    
    // Subscribe to SignalR order updates for real-time refresh
    this.orderUpdateSubscription = this.hub.receiveOrderToKitchen().subscribe(() => {
      console.log('Order update received via SignalR - refreshing history');
      this.loadOrders();
    });
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.orderUpdateSubscription) {
      this.orderUpdateSubscription.unsubscribe();
    }
    this.hub.leaveGroup();
  }

  private loadOrders() {
    this.orders$ = this.clientService.getHistory();
  }

  getOrderStatusColor(status: string): string {
    switch(status?.toLowerCase()) {
        case 'completed': return 'success';
        case 'cancelled': return 'danger';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
  }

  getOrderTotal(order: any): number {
    if (order.meal && order.quantity) {
      return order.meal.price * order.quantity;
    }
    return 0;
  }

  getStatusLabel(statusId: number, isCancel: boolean): string {
    if (isCancel) return 'Cancelado';
    switch(statusId) {
        case 1: return 'Pendiente';
        case 2: return 'En Preparación';
        case 3: return 'Listo para Recoger';
        default: return 'Desconocido';
    }
  }

  getStatusClass(statusId: number, isCancel: boolean): string {
    if (isCancel) return 'status-cancelled';
    switch(statusId) {
        case 1: return 'status-pending';
        case 2: return 'status-preparing';
        case 3: return 'status-ready';
        default: return 'status-unknown';
    }
  }

  canCancelOrder(order: any): boolean {
    return order.statusOrderId === 1 && !order.isCancel;
  }

  cancelOrder(order: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas cancelar este pedido?',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientService.cancelOrder(order.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Pedido Cancelado',
              detail: 'Tu pedido ha sido cancelado exitosamente.'
            });
            // Refresh history
            this.loadOrders();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'No se pudo cancelar el pedido.'
            });
          }
        });
      }
    });
  }
}
