import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventoryPrediction {
  mealId: number;
  mealName: string;
  currentStock: number;
  averageDailyConsumption: number;
  predictedConsumption: number;
  suggestedReorder: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiBase}inventory`;

  constructor(private http: HttpClient) { }

  getPredictions(days: number = 7): Observable<InventoryPrediction[]> {
    return this.http.get<InventoryPrediction[]>(`${this.apiUrl}/predict?days=${days}`);
  }

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getInventoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createInventory(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  updateInventory(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }

  deleteInventory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
