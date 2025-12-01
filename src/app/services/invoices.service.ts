import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InvoicesInterface } from '../interfaces/invoices.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService implements InvoicesInterface {
  private apiUrl = environment.apiBase;

  constructor(private http: HttpClient) { }

  generateInvoice(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Invoices`, request);
  }
}
