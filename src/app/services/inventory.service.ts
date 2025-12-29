import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory.model';
import { InventoryInterface } from '../interfaces/inventory.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends InventoryInterface {

  private apiUrl = `${environment.apiBase}Inventory`;

  constructor(private http: HttpClient) {
    super();
  }

  getItems(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  getItemsByInstance(): Observable<Inventory[]> {
     return this.http.get<Inventory[]>(this.apiUrl);
  }

  getItem(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/${id}`);
  }

  createItem(item: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(this.apiUrl, item);
  }

  updateItem(id: number, item: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  predict(days: number = 7): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/predict?days=${days}`);
  }

  recordWaste(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/waste`, item);
  }
}
