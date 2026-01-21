import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientPortalService } from '../../services/client-portal.service';
import { ClientNavigationComponent } from '../components/client-navigation/client-navigation.component';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [
    CommonModule,
    ClientNavigationComponent,
    ProgressSpinnerModule,
    ButtonModule,
    ToastModule,
    CardModule,
    TagModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './client-history.component.html',
  styleUrls: ['./client-history.component.css'],
  providers: [MessageService]
})
export class ClientHistoryComponent implements OnInit {
  orderGroups: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalCount: number = 0;

  showReorderDialog: boolean = false;
  selectedDinerId: number | null = null;
  selectedBranchIdentity: string = '';
  
  minDate: Date = new Date(); // For calendar picker
  
  orderTypes = [
    { label: 'Recoger', value: 1 },
    { label: 'Domicilio', value: 2 }
  ];
  
  reorderForm = {
    orderType: 1,
    pickupTime: null as Date | null,
    deliveryAddress: ''
  };

  constructor(
    private clientService: ClientPortalService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.clientService.getHistory(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.orderGroups = response.orders;
        this.currentPage = response.pagination.page;
        this.pageSize = response.pagination.pageSize;
        this.totalCount = response.pagination.totalCount;
        this.totalPages = response.pagination.totalPages;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo cargar el historial'
        });
        this.isLoading = false;
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadHistory();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadHistory();
    }
  }

  getOrderTypeLabel(orderType: number): string {
    switch (orderType) {
      case 0: return 'En Mesa';
      case 1: return 'Recoger';
      case 2: return 'Domicilio';
      default: return 'Desconocido';
    }
  }

  getOrderTypeIcon(orderType: number): string {
    switch (orderType) {
      case 0: return 'pi-utensils';
      case 1: return 'pi-shopping-bag';
      case 2: return 'pi-car';
      default: return 'pi-question';
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status.toLowerCase()) {
      case 'pagado': return 'success';
      case 'pendiente': return 'warning';
      default: return 'info';
    }
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  openReorderDialog(group: any) {
    this.selectedDinerId = group.dinerId;
    this.selectedBranchIdentity = group.branch.identity;
    this.showReorderDialog = true;
    
    // Reset form
    this.reorderForm = {
      orderType: 1,
      pickupTime: new Date(),
      deliveryAddress: ''
    };
  }

  confirmReorder() {
    if (!this.selectedDinerId || !this.selectedBranchIdentity) return;

    const orderDetails = {
      instanceIdentity: this.selectedBranchIdentity,
      orderType: this.reorderForm.orderType,
      pickupTime: this.reorderForm.pickupTime || undefined,
      deliveryAddress: this.reorderForm.deliveryAddress || undefined
    };

    this.clientService.reorder(this.selectedDinerId, orderDetails).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Re-orden exitosa!',
          detail: `Se creó una nueva orden con ${response.itemCount} items`
        });
        this.showReorderDialog = false;
        this.loadHistory();
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo crear la orden'
        });
      }
    });
  }
}
