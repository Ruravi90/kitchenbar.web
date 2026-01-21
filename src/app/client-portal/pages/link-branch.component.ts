import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientPortalService } from '../../services/client-portal.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-link-branch',
  templateUrl: './link-branch.component.html',
  styleUrls: ['./link-branch.component.css']
})
export class LinkBranchComponent implements OnInit {
  branchIdentity: string = '';
  isScanning: boolean = false;
  isProcessing: boolean = false;
  showConfirmation: boolean = false;
  branchData: any = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientPortalService: ClientPortalService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    // Check for URL parameter
    this.branchIdentity = this.route.snapshot.paramMap.get('branchIdentity') || '';
    
    if (this.branchIdentity) {
      this.loadBranchPreview();
    } else {
      this.isScanning = true;
    }
  }
  
  onScanSuccess(decodedText: string) {
    // Extract branchIdentity from URL or direct code
    const match = decodedText.match(/link-branch\/([a-f0-9-]+)/i);
    this.branchIdentity = match ? match[1] : decodedText;
    
    this.isScanning = false;
    this.loadBranchPreview();
  }

  onScanError(error: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: error
    });
  }
  
  loadBranchPreview() {
    this.isProcessing = true;
    this.clientPortalService.getBranchPreview(this.branchIdentity).subscribe({
      next: (branch: any) => {
        this.branchData = branch;
        this.showConfirmation = true;
        this.isProcessing = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo cargar la información del restaurante'
        });
        this.isProcessing = false;
        this.isScanning = true;
      }
    });
  }
  
  confirmAddFavorite() {
    if (!this.clientPortalService.isAuthenticated()) {
      localStorage.setItem('link_branch_redirect', this.branchIdentity);
      this.router.navigate(['/client-portal/login']);
      return;
    }
    
    this.isProcessing = true;
    this.clientPortalService.linkBranch(this.branchIdentity).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Agregado a favoritos!',
          detail: `${this.branchData.name} ahora está en tus favoritos`
        });
        this.showConfirmation = false;
        this.isProcessing = false;
        
        // Navigate to favorites after 1 second
        setTimeout(() => {
          this.router.navigate(['/client-portal/favorites']);
        }, 1000);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo vincular el restaurante'
        });
        this.isProcessing = false;
      }
    });
  }
  
  goToMenu() {
    this.router.navigate(['/menu', this.branchIdentity]);
  }
  
  cancelAndRescan() {
    this.showConfirmation = false;
    this.branchData = null;
    this.isScanning = true;
  }
}
