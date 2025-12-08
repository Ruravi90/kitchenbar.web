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
  selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ToolbarModule, ToastModule, ConfirmDialogModule],
  templateUrl: './package-list.component.html',
  styleUrl: './package-list.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class PackageListComponent implements OnInit {
  packages: any[] = [];
  loading: boolean = true;

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages() {
    this.loading = true;
    this.adminService.getPackages().subscribe({
      next: (data) => {
        this.packages = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load packages' });
        this.loading = false;
      }
    });
  }

  deletePackage(pkg: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + pkg.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.deletePackage(pkg.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Package Deleted', life: 3000 });
            this.loadPackages();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete package' });
          }
        });
      }
    });
  }
}
