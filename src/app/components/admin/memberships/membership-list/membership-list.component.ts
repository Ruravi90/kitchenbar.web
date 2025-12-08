import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import { Membership, Instance, License } from '../../../../models';

@Component({
  selector: 'app-membership-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    TableModule, 
    ButtonModule, 
    ToolbarModule, 
    ToastModule,
    DialogModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './membership-list.component.html',
  styleUrl: './membership-list.component.scss',
  providers: [MessageService]
})
export class MembershipListComponent implements OnInit {
  memberships: Membership[] = [];
  instances: Instance[] = [];
  licenses: License[] = [];
  loading: boolean = true;

  membershipDialog: boolean = false;
  membership: Partial<Membership> = {};
  selectedInstance: Instance | null = null;
  selectedLicense: License | null = null;
  rangeDates: Date[] | undefined;
  submitted: boolean = false;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.adminService.getMemberships().subscribe({
      next: (data) => {
        this.memberships = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load memberships' });
        this.loading = false;
      }
    });

    this.adminService.getInstances().subscribe(data => this.instances = data);
    this.adminService.getLicenses().subscribe(data => this.licenses = data);
  }

  openNew() {
    this.membership = {};
    this.selectedInstance = null;
    this.selectedLicense = null;
    this.rangeDates = undefined;
    this.submitted = false;
    this.membershipDialog = true;
  }

  hideDialog() {
    this.membershipDialog = false;
    this.submitted = false;
  }

  saveMembership() {
    this.submitted = true;

    if (this.selectedInstance && this.selectedLicense && this.rangeDates?.length === 2 && this.rangeDates[0] && this.rangeDates[1]) {
        // Construct the membership object
        const newMembership: Membership = {
            id: 0, // Backend assigns ID
            instanceId: this.selectedInstance.id,
            licenseId: this.selectedLicense.id,
            startDate: this.rangeDates[0].toISOString(),
            endDate: this.rangeDates[1].toISOString(),
            status: 'Active' // Default
        };

        this.adminService.createMembership(newMembership).subscribe({
            next: (created) => {
                this.memberships.push(created);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Membership Created', life: 3000 });
                this.membershipDialog = false;
                this.loadData(); // To refresh relations if needed
            },
            error: (err) => {
                const errorMsg = err.error || 'Failed to create membership';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
            }
        });
    }
  }
}
