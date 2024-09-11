import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = environment.apiBase + 'orders';
  constructor(private http: HttpClient) { }
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getItemsByInstance(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/byInstance");
  }
  getItemsByTable(identity:string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/byTable/"+identity);
  }
  getItemWithIncludes(id:number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}/WithIncludes`);
  }
  getItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  createItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }
  updateItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }
  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
