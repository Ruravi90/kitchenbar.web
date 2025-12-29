import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, DividerModule],
  template: `
    <div class="scanner-container">
      <div [id]="elementId" class="qr-reader"></div>
      
      <div class="manual-input" *ngIf="allowManualInput">
        <p-divider align="center">
          <span class="divider-text">o ingresa el código manualmente</span>
        </p-divider>
        <div class="p-inputgroup">
          <input pInputText 
                 [(ngModel)]="manualCode" 
                 [placeholder]="manualPlaceholder" />
          <button pButton 
                  icon="pi pi-arrow-right" 
                  (click)="submitManualCode()"
                  [disabled]="!manualCode"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scanner-container {
      padding: 1rem;
    }
    .qr-reader {
      max-width: 500px;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
    }
    .manual-input {
      margin-top: 2rem;
     max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    .divider-text {
      background: white;
      padding: 0 1rem;
      color: #6c757d;
      font-size: 0.9rem;
    }
    .p-inputgroup {
      margin-top: 1rem;
    }
  `]
})
export class QrScannerComponent implements OnInit, OnDestroy {
  @Input() allowManualInput: boolean = true;
  @Input() manualPlaceholder: string = 'Código QR';
  @Output() onScanSuccess = new EventEmitter<string>();
  @Output() onScanError = new EventEmitter<string>();
  
  elementId = 'qr-reader-' + Math.random().toString(36).substr(2, 9);
  manualCode: string = '';
  private html5QrCode: any;
  
  async ngOnInit() {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      this.html5QrCode = new Html5Qrcode(this.elementId);
      
      await this.html5QrCode.start(
        { facingMode: "environment" },
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText: string) => {
          this.onScanSuccess.emit(decodedText);
        },
        (error: string) => {
          // Errors de scanning continuo son silenciosos
        }
      );
    } catch (err: any) {
      this.onScanError.emit(err.message || 'No se pudo acceder a la cámara');
    }
  }
  
  submitManualCode() {
    if (this.manualCode.trim()) {
      this.onScanSuccess.emit(this.manualCode.trim());
      this.manualCode = '';
    }
  }
  
  ngOnDestroy() {
    if (this.html5QrCode) {
      this.html5QrCode.stop().catch(() => {});
    }
  }
}
