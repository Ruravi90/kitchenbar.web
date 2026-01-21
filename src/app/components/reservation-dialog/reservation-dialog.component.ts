import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ReservationService } from '../../services/reservation.service';
import {
  AvailabilityResponse,
  ReservationResponse,
  TableLocation,
  TableOption
} from '../../models/reservation.model';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.scss']
})
export class ReservationDialogComponent implements OnInit {
  @Input() branchIdentity: string | undefined;
  @Output() onReservationComplete = new EventEmitter<ReservationResponse>();

  visible: boolean = false;
  step: 'details' | 'availability' | 'confirm' = 'details';

  // Step 1: Details
  partySize: number = 2;
  reservationDate!: Date;
  reservationTime: string = '';
  preferredLocation?: TableLocation;

  // Step 2: Table Selection & Customer Info
  availabilityResult?: AvailabilityResponse;
  selectedTable?: TableOption;
  customerName: string = '';
  customerPhone: string = '';
  customerEmail: string = '';
  specialRequests: string = '';

  // UI State
  checking: boolean = false;
  creating: boolean = false;

  // Options
  partySizes = [
    { label: '1 persona', value: 1 },
    { label: '2 personas', value: 2 },
    { label: '3 personas', value: 3 },
    { label: '4 personas', value: 4 },
    { label: '5 personas', value: 5 },
    { label: '6 personas', value: 6 },
    { label: '7 personas', value: 7 },
    { label: '8 personas', value: 8 },
    { label: '9 personas', value: 9 },
    { label: '10+ personas', value: 10 }
  ];

  locations = [
    { label: 'Sin preferencia', value: undefined },
    { label: 'Interior', value: TableLocation.Interior },
    { label: 'Terraza', value: TableLocation.Terrace },
    { label: 'Barra', value: TableLocation.Bar },
    { label: 'VIP', value: TableLocation.VIP }
  ];

  minDate: Date;

  constructor(
    private reservationService: ReservationService,
    private messageService: MessageService
  ) {
    // Minimum reservation time: 30 minutes from now
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    this.minDate = now;
    this.reservationDate = now;

    // Default time: rounded to next 30-min interval
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 30) * 30;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    this.reservationTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  ngOnInit(): void {}

  open() {
    this.visible = true;
    this.step = 'details';
    this.resetForm();
  }

  resetForm() {
    this.partySize = 2;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    this.reservationDate = now;
    this.selectedTable = undefined;
    this.customerName = '';
    this.customerPhone = '';
    this.customerEmail = '';
    this.specialRequests = '';
    this.availabilityResult = undefined;
  }

  checkAvailability() {
    if (!this.validateStep1()) {
      return;
    }

    if (!this.branchIdentity) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo identificar el restaurante'
      });
      return;
    }

    this.checking = true;
    const dateTime = this.combineDateAndTime();

    this.reservationService.checkAvailability({
      branchIdentity: this.branchIdentity,
      partySize: this.partySize,
      dateTime: dateTime.toISOString()
    }).subscribe({
      next: (result) => {
        this.availabilityResult = result;
        this.checking = false;

        if (result.available && result.availableTables && result.availableTables.length > 0) {
          this.step = 'availability';
          this.selectedTable = result.availableTables[0]; // Auto-select first table
          this.messageService.add({
            severity: 'success',
            summary: '¡Mesas disponibles!',
            detail: result.message
          });
        } else {
          this.showWaitlistDialog(result);
        }
      },
      error: (error) => {
        this.checking = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'No se pudo verificar disponibilidad'
        });
      }
    });
  }

  showWaitlistDialog(result: AvailabilityResponse) {
    if (result.offerWaitlist) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin disponibilidad',
        detail: result.message,
        life: 5000
 });

      // Could implement waitlist functionality here
      // For now, show alternatives
      if (result.suggestedAlternatives && result.suggestedAlternatives.length > 0) {
        const altTimes = result.suggestedAlternatives.map(a => a.label).join(', ');
        this.messageService.add({
          severity: 'info',
          summary: 'Horarios alternativos',
          detail: `Intenta: ${altTimes}`,
          life: 7000
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Sin disponibilidad',
        detail: result.message
      });
    }
  }

  confirmReservation() {
    if (!this.validateStep2()) {
      return;
    }

    if (!this.branchIdentity) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo identificar el restaurante'
      });
      return;
    }

    this.creating = true;
    const dateTime = this.combineDateAndTime();

    this.reservationService.createReservation({
      branchIdentity: this.branchIdentity,
      partySize: this.partySize,
      dateTime: dateTime.toISOString(),
      preferredTableId: this.selectedTable?.id,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail || undefined,
      preferredLocation: this.preferredLocation,
      specialRequests: this.specialRequests || undefined
    }).subscribe({
      next: (response) => {
        this.creating = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Reservación Confirmada',
          detail: response.message,
          life: 5000
        });

        this.visible = false;
        this.onReservationComplete.emit(response);
        this.resetForm();
      },
      error: (error) => {
        this.creating = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'No se pudo crear la reservación'
        });
      }
    });
  }

  goBack() {
    if (this.step === 'availability') {
      this.step = 'details';
    }
  }

  private validateStep1(): boolean {
    if (!this.partySize || this.partySize < 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor selecciona el número de personas'
      });
      return false;
    }

    if (!this.reservationDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor selecciona una fecha'
      });
      return false;
    }

    if (!this.reservationTime) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor selecciona una hora'
      });
      return false;
    }

    const dateTime = this.combineDateAndTime();
    if (dateTime < new Date()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La fecha y hora no pueden ser en el pasado'
      });
      return false;
    }

    return true;
  }

  private validateStep2(): boolean {
    if (!this.selectedTable) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor selecciona una mesa'
      });
      return false;
    }

    if (!this.customerName || this.customerName.trim().length < 2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor ingresa tu nombre completo'
      });
      return false;
    }

    if (!this.customerPhone || this.customerPhone.trim().length < 10) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor ingresa un teléfono válido (mínimo 10 dígitos)'
      });
      return false;
    }

    return true;
  }

  private combineDateAndTime(): Date {
    const date = new Date(this.reservationDate);
    const [hours, minutes] = this.reservationTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  getLocationLabel(location: string): string {
    const locationMap: Record<string, string> = {
      'Interior': '🏠 Interior',
      'Terrace': '🌳 Terraza',
      'Bar': '🍷 Barra',
      'VIP': '⭐ VIP',
      'Private': '🚪 Privado'
    };
    return locationMap[location] || location;
  }
}
