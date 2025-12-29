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
  linkedBranch: any = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientPortalService: ClientPortalService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    // Si viene de URL directa: /client-portal/link-branch/:branchIdentity
    this.branchIdentity = this.route.snapshot.paramMap.get('branchIdentity') || '';
    
    if (this.branchIdentity) {
      this.attemptLink();
    } else {
      this.isScanning = true;
    }
  }
  
  onScanSuccess(decodedText: string) {
    // Extraer branchIdentity de URL o código directo
    const match = decodedText.match(/link-branch\/([a-f0-9-]+)/i);
    this.branchIdentity = match ? match[1] : decodedText;
    
    this.isScanning = false;
    this.attemptLink();
  }

  onScanError(error: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: error
    });
  }
  
  attemptLink() {
    if (!this.clientPortalService.isAuthenticated()) {
      localStorage.setItem('link_branch_redirect', this.branchIdentity);
      this.router.navigate(['/client-portal/login']);
      return;
    }
    
    this.isProcessing = true;
    this.clientPortalService.linkBranch(this.branchIdentity).subscribe({
      next: (response: any) => {
        this.linkedBranch = response.branch;
        this.messageService.add({
          severity: 'success',
          summary: '¡Agregado a favoritos!',
          detail: `${response.branch.name} ahora está en tus favoritos`
        });
        this.isProcessing = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo vincular el restaurante'
        });
        this.isProcessing = false;
        this.isScanning = true; // Permitir reintentar
      }
    });
  }
  
  navigateToMenu() {
    this.router.navigate(['/menu', this.branchIdentity]);
  }
  
  navigateToFavorites() {
    this.router.navigate(['/client-portal/favorites']);
  }
}
