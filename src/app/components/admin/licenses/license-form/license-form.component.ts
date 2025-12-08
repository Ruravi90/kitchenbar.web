import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-license-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, InputNumberModule, ButtonModule, ToastModule, InputTextareaModule],
  templateUrl: './license-form.component.html',
  styleUrl: './license-form.component.scss',
  providers: [MessageService]
})
export class LicenseFormComponent implements OnInit {
  licenseForm: FormGroup;
  isEditMode: boolean = false;
  licenseId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.licenseForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      period: [30, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      features: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.licenseId = +params['id'];
        this.loadLicense(this.licenseId);
      }
    });
  }

  loadLicense(id: number) {
    this.loading = true;
    this.adminService.getLicense(id).subscribe({
      next: (data) => {
        this.licenseForm.patchValue(data);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load license' });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.licenseForm.invalid) {
      return;
    }

    this.loading = true;
    const licenseData = { ...this.licenseForm.value };

    // Validate features JSON or set to null if empty
    if (!licenseData.features || licenseData.features.trim() === '') {
      licenseData.features = null;
    } else {
      try {
        JSON.parse(licenseData.features);
      } catch (e) {
        this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Features must be valid JSON format (e.g. {"key": "value"})' });
        this.loading = false;
        return;
      }
    }

    if (this.isEditMode && this.licenseId) {
      this.adminService.updateLicense(this.licenseId, licenseData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'License Updated', life: 3000 });
          setTimeout(() => {
            this.router.navigate(['/admin/licenses']);
          }, 1000);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update license' });
          this.loading = false;
        }
      });
    } else {
      this.adminService.createLicense(licenseData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'License Created', life: 3000 });
          setTimeout(() => {
            this.router.navigate(['/admin/licenses']);
          }, 1000);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create license' });
          this.loading = false;
        }
      });
    }
  }
}
