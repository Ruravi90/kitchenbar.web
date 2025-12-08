import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService } from '../services/admin.service';


@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrl: './licenses.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class LicensesComponent implements OnInit {
  licenses: any[] = [];
  loading: boolean = true;

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadLicenses();
  }

  loadLicenses() {
    this.loading = true;
    this.adminService.getLicenses().subscribe({
      next: (data) => {
        this.licenses = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load licenses' });
        this.loading = false;
      }
    });
  }

  deleteLicense(license: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + license.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.deleteLicense(license.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'License Deleted', life: 3000 });
            this.loadLicenses();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete license' });
          }
        });
      }
    });
  }
}
