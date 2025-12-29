import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientPortalService } from '../../services/client-portal.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-checkin-table',
  templateUrl: './checkin-table.component.html',
  styleUrls: ['./checkin-table.component.css']
})
export class CheckinTableComponent implements OnInit {
  tableIdentity: string = '';
  isScanning: boolean = false;
  isProcessing: boolean = false;
  sessionData: any = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientPortalService: ClientPortalService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    this.tableIdentity = this.route.snapshot.paramMap.get('tableIdentity') || '';
    
    if (this.tableIdentity) {
      this.attemptCheckin();
    } else {
      this.isScanning = true;
    }
  }
  
  onScanSuccess(decodedText: string) {
    // Extraer tableIdentity - puede ser URL completa o solo GUID
    const match = decodedText.match(/([a-f0-9-]{36})/i);
    this.tableIdentity = match ? match[1] : decodedText;
    
    this.isScanning = false;
    this.attemptCheckin();
  }

  onScanError(error: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: error
    });
  }
  
  attemptCheckin() {
    if (!this.clientPortalService.isAuthenticated()) {
      localStorage.setItem('checkin_redirect', this.tableIdentity);
      this.router.navigate(['/client-portal/login']);
      return;
    }
    
    this.isProcessing = true;
    this.clientPortalService.checkinTable(this.tableIdentity).subscribe({
      next: (response: any) => {
        this.sessionData = response;
        this.messageService.add({
          severity: 'success',
          summary: 'Check-in exitoso',
          detail: `Bienvenido a ${response.branchName} - Mesa ${response.tableName}`
        });
        this.isProcessing = false;
        
        // Auto-navegar al menú después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/menu', this.tableIdentity]);
        }, 2000);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo completar el check-in'
        });
        this.isProcessing = false;
        
        // Si ya tiene sesión activa, mostrar opción de continuar
        if (error.error?.dinerId) {
          this.sessionData = error.error;
        } else {
          this.isScanning = true; // Permitir reintentar
        }
      }
    });
  }

  goToExistingSession() {
    if (this.sessionData?.tableIdentity) {
      this.router.navigate(['/client', this.sessionData.tableIdentity]);
    } else if (this.tableIdentity) {
      // Fallback to current tableIdentity if not provided in error
      this.router.navigate(['/client', this.tableIdentity]);
    }
  }
}
