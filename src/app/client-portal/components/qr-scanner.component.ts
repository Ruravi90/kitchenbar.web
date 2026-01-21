import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit, OnDestroy {
  @Output() scanSuccess = new EventEmitter<string>();
  @Output() scanError = new EventEmitter<string>();
  
  @ViewChild('scannerContainer', { static: false }) scannerContainer!: ElementRef;
  
  private html5QrCode: Html5Qrcode | null = null;
  private readonly scannerId = 'qr-scanner-container';
  
  isScanning: boolean = false;
  hasTorch: boolean = false;
  torchOn: boolean = false;
  permissionDenied: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.startScanner();
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  async startScanner() {
    try {
      this.html5QrCode = new Html5Qrcode(this.scannerId);
      
      // Check for torch (flashlight) capability
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        // Try to use back camera (usually has torch)
        const backCamera = cameras.find(camera => 
          camera.label.toLowerCase().includes('back') || 
          camera.label.toLowerCase().includes('rear')
        ) || cameras[0];
        
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };

        await this.html5QrCode.start(
          backCamera.id,
          config,
          (decodedText) => {
            // Success callback
            this.onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Error callback - can be ignored for most cases
            // Only log severe errors
          }
        );

        this.isScanning = true;
        
        // Check if torch is available
        this.checkTorchCapability();
      } else {
        this.errorMessage = 'No se encontraron cámaras en el dispositivo';
        this.scanError.emit(this.errorMessage);
      }
    } catch (err: any) {
      console.error('Error starting QR scanner:', err);
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        this.permissionDenied = true;
        this.errorMessage = 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara.';
      } else {
        this.errorMessage = 'Error al iniciar el escáner: ' + (err.message || 'Error desconocido');
      }
      this.scanError.emit(this.errorMessage);
    }
  }

  async stopScanner() {
    if (this.html5QrCode && this.html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
      try {
        await this.html5QrCode.stop();
        this.html5QrCode.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    this.isScanning = false;
  }

  onScanSuccess(decodedText: string) {
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    // Stop scanner and emit success
    this.stopScanner();
    this.scanSuccess.emit(decodedText);
  }

  async toggleTorch() {
    if (!this.hasTorch || !this.html5QrCode) return;
    
    try {
      // Note: torch control is not directly available in html5-qrcode
      // This is a placeholder for future implementation or using native APIs
      this.torchOn = !this.torchOn;
      console.log('Torch toggle requested:', this.torchOn);
      // Would need to access video stream directly for torch control
    } catch (err) {
      console.error('Error toggling torch:', err);
    }
  }

  private checkTorchCapability() {
    // Check if device supports torch
    // This is a simplified check, actual implementation would require
    // accessing the video track capabilities
    if (navigator.mediaDevices && navigator.mediaDevices.getSupportedConstraints) {
      const supports = navigator.mediaDevices.getSupportedConstraints() as any;
      this.hasTorch = 'torch' in supports;
    }
  }

  requestPermission() {
    this.permissionDenied = false;
    this.errorMessage = '';
    this.startScanner();
  }
}
