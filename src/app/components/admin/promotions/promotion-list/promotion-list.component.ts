import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToolbarModule, ToastModule, ConfirmDialogModule],
  templateUrl: './promotion-list.component.html',
  styleUrl: './promotion-list.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class PromotionListComponent implements OnInit {
  promotions: any[] = [];
  loading: boolean = true;

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions() {
    this.loading = true;
    this.adminService.getPromotions().subscribe({
      next: (data) => {
        this.promotions = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load promotions' });
        this.loading = false;
      }
    });
  }

  deletePromotion(promo: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete promotion ' + promo.code + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.deletePromotion(promo.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Promotion Deleted', life: 3000 });
            this.loadPromotions();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete promotion' });
          }
        });
      }
    });
  }
}
