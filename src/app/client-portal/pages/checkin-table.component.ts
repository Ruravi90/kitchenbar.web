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
  showConflictDialog: boolean = false;
  conflictData: any = null;
  
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
    // Extract tableIdentity - can be full URL or just GUID
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
        
        // Auto-navigate to menu after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/menu', this.tableIdentity]);
        }, 2000);
      },
      error: (error: any) => {
        this.isProcessing = false;
        
        // Check if it's a session conflict (409)
        if (error.status === 409 && error.error?.code === 'ACTIVE_SESSION_EXISTS') {
          this.conflictData = {
            ...error.error,
            newTableIdentity: this.tableIdentity
          };
          this.showConflictDialog = true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'No se pudo completar el check-in'
          });
          this.isScanning = true;
        }
      }
    });
  }

  handleConflictAction(action: string) {
    switch (action) {
      case 'continue':
        this.continueExistingSession();
        break;
      case 'transfer':
        this.transferToNewTable();
        break;
      case 'close':
        this.closeAndCheckin();
        break;
    }
  }

  continueExistingSession() {
    this.showConflictDialog = false;
    const tableIdentity = this.conflictData.activeSession.tableIdentity;
    this.router.navigate(['/menu', tableIdentity]);
  }

  transferToNewTable() {
    this.isProcessing = true;
    this.clientPortalService.transferSession(
      this.conflictData.activeSession.dinerId,
      this.conflictData.newTableIdentity
    ).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sesión transferida',
          detail: `Ahora estás en ${response.tableName}`
        });
        this.showConflictDialog = false;
        this.isProcessing = false;
        
        setTimeout(() => {
          this.router.navigate(['/menu', this.conflictData.newTableIdentity]);
        }, 1500);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo transferir la sesión'
        });
        this.isProcessing = false;
      }
    });
  }

  closeAndCheckin() {
    this.isProcessing = true;
    this.clientPortalService.closeSession(this.conflictData.activeSession.dinerId).subscribe({
      next: () => {
        this.showConflictDialog = false;
        // Now attempt check-in again
        this.attemptCheckin();
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo cerrar la sesión anterior'
        });
        this.isProcessing = false;
      }
    });
  }
}
