import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../tokens/environment.token';
import { InvoicesInterface } from '../interfaces/invoices.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService implements InvoicesInterface {
  private env = inject(ENVIRONMENT_TOKEN);
  private apiUrl = this.env.apiBase;

  constructor(private http: HttpClient) { }

  generateInvoice(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Invoices`, request);
  }
}
