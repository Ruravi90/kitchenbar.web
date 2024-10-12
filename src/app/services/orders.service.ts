import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, User } from '../models';
import { AuthInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiUrl = environment.apiBase + 'orders';
  private currentUser:User = new User();
  constructor(private http: HttpClient, private auth: AuthInterface) {
      this.currentUser = auth.getCurrentUser();
   }
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getItemsByInstance(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/byInstance");
  }
  getItemsAllPerDay(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/perDay");
  }
  getItemsByTable(dinerId:number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/byTable/"+dinerId);
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
