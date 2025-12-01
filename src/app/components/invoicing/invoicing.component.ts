import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DinersInterface, InvoicesInterface } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.component.html',
  providers: [MessageService]
})
export class InvoicingComponent implements OnInit {

  step: number = 1;
  
  searchForm: any = {
    contact: ''
  };

  fiscalData: any = {
    rfc: '',
    legalName: '',
    taxRegime: '',
    zipCode: '',
    address: '',
    email: '',
    useCfdi: 'G03'
  };

  pendingTickets: any[] = [];
  selectedTicket: any = null;
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private invoicesService: InvoicesInterface,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  searchTickets() {
    if (!this.searchForm.contact) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ingrese su Correo o Teléfono.' });
      return;
    }

    this.loading = true;
    const apiUrl = environment.apiBase + 'Diners/pending-tickets';
    this.http.get<any[]>(apiUrl, { params: { contact: this.searchForm.contact } })
      .subscribe({
        next: (response) => {
          this.pendingTickets = response;
          this.loading = false;
          if (this.pendingTickets.length === 0) {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No se encontraron tickets pendientes de facturar para este mes.' });
          } else {
             // Pre-fill email if contact is email
             if (this.searchForm.contact.includes('@')) {
                this.fiscalData.email = this.searchForm.contact;
             }
          }
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al buscar tickets.' });
        }
      });
  }

  selectTicket(ticket: any) {
      this.selectedTicket = ticket;
      this.step = 2;
  }

  generateInvoice() {
    this.loading = true;
    const request = {
      dinerId: this.selectedTicket.id,
      ...this.fiscalData
    };

    this.invoicesService.generateInvoice(request).subscribe({
      next: (invoice) => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Factura generada correctamente.' });
        this.step = 3;
        if (invoice.pdfUrl) {
            window.open(invoice.pdfUrl, '_blank');
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar la factura.' });
      }
    });
  }

  reset() {
    this.step = 1;
    this.pendingTickets = [];
    this.selectedTicket = null;
    this.searchForm = { contact: '' };
    this.fiscalData = {
        rfc: '',
        legalName: '',
        taxRegime: '',
        zipCode: '',
        address: '',
        email: '',
        useCfdi: 'G03'
      };
  }
}
