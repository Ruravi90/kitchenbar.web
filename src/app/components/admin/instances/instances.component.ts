import { Component } from '@angular/core';
import { Instance, License, Membership } from '../../../models';
import { InstancesService } from '../../../services';
import { AdminService } from '../services/admin.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrl: './instances.component.scss'
})
export class InstancesComponent {

  constructor(
    private messageService: MessageService,
    private instanceServices: InstancesService,
    private adminService: AdminService
  ){}

  items: Instance[] = [];
  licenses: License[] = [];
  
  // Renew Dialog
  renewDialog: boolean = false;
  selectedInstance: Instance | null = null;
  selectedLicense: License | null = null;
  rangeDates: Date[] | undefined;
  submitted: boolean = false;

  ngOnInit(): void {
    this.retrieveTables();
    this.adminService.getLicenses().subscribe(data => this.licenses = data);
  }

  retrieveTables(): void {
    this.instanceServices.getItems().subscribe({
      next: (data) => {
        this.items = data;
        // console.log(data);
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
  }

  openRenew(instance: Instance) {
      this.selectedInstance = instance;
      this.selectedLicense = null; // Maybe pre-select current license?
      this.rangeDates = undefined;
      this.submitted = false;
      this.renewDialog = true;
  }

  hideDialog() {
      this.renewDialog = false;
      this.submitted = false;
  }

  saveRenewal() {
      this.submitted = true;
       if (this.selectedInstance && this.selectedLicense && this.rangeDates?.length === 2 && this.rangeDates[0] && this.rangeDates[1]) {
           const newMembership: Membership = {
              id: 0,
              instanceId: this.selectedInstance.id,
              licenseId: this.selectedLicense.id,
              startDate: this.rangeDates[0].toISOString(),
              endDate: this.rangeDates[1].toISOString(),
              status: 'Active'
          };
          this.adminService.createMembership(newMembership).subscribe({
              next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Membership Renewed', life: 3000 });
                  this.renewDialog = false;
                  this.retrieveTables(); // Refresh to see new date
              },
              error: (err) => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to renew' });
              }
          });
       }
  }

  getActiveExpiration(instance: Instance): Date | null {
      if (!instance.memberships || instance.memberships.length === 0) return null;
      // Simple logic: return the latest end date of an active membership, or just the latest end date
      // Assuming backend sorts or we sort here. 
      // Let's find the latest EndDate
      const dates = instance.memberships.map(m => new Date(m.endDate));
      return new Date(Math.max.apply(null, dates as any));
  }
}
