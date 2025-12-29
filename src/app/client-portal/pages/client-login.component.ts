import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientPortalService } from '../../services/client-portal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css']
})
export class ClientLoginComponent {
  isLoginMode = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientPortalService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    
    this.clientService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        
        // Check if there's a pending checkin redirect (table QR)
        const pendingCheckin = localStorage.getItem('checkin_redirect');
        if (pendingCheckin) {
          localStorage.removeItem('checkin_redirect');
          this.router.navigate(['/client-portal/checkin-table', pendingCheckin]);
          return;
        }
        
        // Check if there's a pending branch link redirect (branch QR)
        const pendingBranch = localStorage.getItem('link_branch_redirect');
        if (pendingBranch) {
          localStorage.removeItem('link_branch_redirect');
          this.router.navigate(['/client-portal/link-branch', pendingBranch]);
          return;
        }
        
        // No redirect, go to profile
        this.router.navigate(['/client-portal/profile']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const { confirmPassword, ...userData } = this.registerForm.value;

    this.clientService.register(userData).subscribe({
      next: (res) => {
        this.loading = false;
        
        // Check if there's a pending checkin redirect (table QR)
        const pendingCheckin = localStorage.getItem('checkin_redirect');
        if (pendingCheckin) {
          // Auto-login after registration and redirect to table
          this.clientService.login({ email: userData.email, password: userData.password }).subscribe({
            next: (loginRes) => {
              localStorage.removeItem('checkin_redirect');
              this.router.navigate(['/client-portal/checkin-table', pendingCheckin]);
            },
            error: (loginErr) => {
              // If auto-login fails, switch to login mode
              this.isLoginMode = true;
              this.errorMessage = 'Registration successful! Please login.';
              this.loginForm.patchValue({ email: userData.email });
            }
          });
          return;
        }
        
        // Check if there's a pending branch link redirect (branch QR)
        const pendingBranch = localStorage.getItem('link_branch_redirect');
        if (pendingBranch) {
          // Auto-login after registration and redirect to branch
          this.clientService.login({ email: userData.email, password: userData.password }).subscribe({
            next: (loginRes) => {
              localStorage.removeItem('link_branch_redirect');
              this.router.navigate(['/client-portal/link-branch', pendingBranch]);
            },
            error: (loginErr) => {
              // If auto-login fails, switch to login mode
              this.isLoginMode = true;
              this.errorMessage = 'Registration successful! Please login.';
              this.loginForm.patchValue({ email: userData.email });
            }
          });
          return;
        }
        
        // No redirect pending, just switch to login mode
        this.isLoginMode = true;
        this.errorMessage = 'Registration successful! Please login.';
        this.loginForm.patchValue({ email: userData.email });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
      }
    });
  }
}
