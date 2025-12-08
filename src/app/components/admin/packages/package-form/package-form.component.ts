import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-package-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, InputNumberModule, ButtonModule, ToastModule],
  templateUrl: './package-form.component.html',
  styleUrl: './package-form.component.scss',
  providers: [MessageService]
})
export class PackageFormComponent implements OnInit {
  packageForm: FormGroup;
  isEditMode: boolean = false;
  packageId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.packageForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      credits: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.packageId = +params['id'];
        this.loadPackage(this.packageId);
      }
    });
  }

  loadPackage(id: number) {
    this.loading = true;
    this.adminService.getPackage(id).subscribe({
      next: (data) => {
        this.packageForm.patchValue(data);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load package' });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.packageForm.invalid) {
      return;
    }

    this.loading = true;
    const packageData = this.packageForm.value;

    if (this.isEditMode && this.packageId) {
      this.adminService.updatePackage(this.packageId, packageData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Package Updated', life: 3000 });
          setTimeout(() => {
            this.router.navigate(['/admin/packages']);
          }, 1000);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update package' });
          this.loading = false;
        }
      });
    } else {
      this.adminService.createPackage(packageData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Package Created', life: 3000 });
          setTimeout(() => {
            this.router.navigate(['/admin/packages']);
          }, 1000);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create package' });
          this.loading = false;
        }
      });
    }
  }
}
