import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import { Membership } from '../../../../models';

@Component({
  selector: 'app-membership-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, ToastModule, ConfirmDialogModule],
  templateUrl: './membership-detail.component.html',
  styleUrl: './membership-detail.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class MembershipDetailComponent implements OnInit {
  membership: Membership | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadMembership(+params['id']);
      }
    });
  }

  loadMembership(id: number) {
    this.loading = true;
    this.adminService.getMembership(id).subscribe({
      next: (data) => {
        this.membership = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load membership details' });
        this.loading = false;
      }
    });
  }

  cancelMembership() {
    if (!this.membership || !this.membership.id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this membership?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
         // Create a copy and update status
        const updatedMembership: Membership = { ...this.membership!, status: 'Cancelled' };
        
        if (updatedMembership.id) {
            this.adminService.updateMembership(updatedMembership.id, updatedMembership).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Membership Cancelled', life: 3000 });
                if (updatedMembership.id) this.loadMembership(updatedMembership.id);
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to cancel membership' });
            }
            });
        }
      }
    });
  }
}
