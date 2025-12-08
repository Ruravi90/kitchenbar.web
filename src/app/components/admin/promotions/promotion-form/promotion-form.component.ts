import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, InputNumberModule, ButtonModule, ToastModule, CalendarModule, DropdownModule],
  templateUrl: './promotion-form.component.html',
  styleUrl: './promotion-form.component.scss',
  providers: [MessageService]
})
export class PromotionFormComponent implements OnInit {
  promotionForm: FormGroup;
  isEditMode: boolean = false;
  promotionId: number | null = null;
  loading: boolean = false;
  discountTypes = [
    { label: 'Percentage', value: 'Percentage' },
    { label: 'Fixed Amount', value: 'Fixed' }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.promotionForm = this.fb.group({
      code: ['', Validators.required],
      discountType: ['Percentage', Validators.required],
      discountValue: [0, [Validators.required, Validators.min(0)]],
      validFrom: [null, Validators.required],
      validTo: [null, Validators.required],
      maxUsage: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.promotionId = +params['id'];
        this.loadPromotion(this.promotionId);
      }
    });
  }

  loadPromotion(id: number) {
    this.loading = true;
    this.adminService.getPromotion(id).subscribe({
      next: (data) => {
        // Convert dates to Date objects for Calendar component
        if (data.validFrom) data.validFrom = new Date(data.validFrom);
        if (data.validTo) data.validTo = new Date(data.validTo);
        this.promotionForm.patchValue(data);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load promotion' });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.promotionForm.invalid) {
      return;
    }

    this.loading = true;
    const promotionData = this.promotionForm.value;

    if (this.isEditMode && this.promotionId) {
      this.adminService.updatePromotion(this.promotionId, promotionData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Promotion Updated', life: 3000 });
          setTimeout(() => {
            this.router.navigate(['/admin/promotions']);
          }, 1000);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update promotion' });
          this.loading = false;
        }
      });
    } else {
      this.adminService.createPromotion(promotionData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Promotion Created', life: 3000 });
          setTimeout(() => {
            this.router.navigate(['/admin/promotions']);
          }, 1000);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create promotion' });
          this.loading = false;
        }
      });
    }
  }
}
