import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientPortalService } from '../../services/client-portal.service';
import { ClientUser, ClientAddress } from '../../interfaces/client-portal.interface';
import { Router } from '@angular/router';
import { ClientNavigationComponent } from '../components/client-navigation/client-navigation.component';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClientNavigationComponent],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  user: ClientUser | null = null;
  addresses: ClientAddress[] = [];
  addressForm: FormGroup;
  showAddressForm = false;
  loading = false;

  constructor(
    private clientService: ClientPortalService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      tagName: ['Casa', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      instructions: ['']
    });
  }

  ngOnInit() {
    this.clientService.currentUser$.subscribe(u => {
        this.user = u;
        if (!u) {
            this.router.navigate(['/client-portal/login']);
        } else {
            // Only load addresses if user is authenticated
            this.loadAddresses();
        }
    });
  }

  loadAddresses() {
    this.clientService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res;
      },
      error: (err) => {
        // Handle error silently or show message
        console.error('Error loading addresses:', err);
      }
    });
  }

  toggleAddressForm() {
    this.showAddressForm = !this.showAddressForm;
  }

  cancelAddress() {
    this.showAddressForm = false;
    this.addressForm.reset({ tagName: 'Home' });
  }

  onAddAddress() {
    if (this.addressForm.invalid) return;
    this.loading = true;
    
    this.clientService.addAddress(this.addressForm.value).subscribe({
      next: (newAddress) => {
        this.addresses.push(newAddress);
        this.loading = false;
        this.showAddressForm = false;
        this.addressForm.reset({ tagName: 'Home' });
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  logout() {
    this.clientService.logout();
    this.router.navigate(['/client-portal/login']);
  }
}
