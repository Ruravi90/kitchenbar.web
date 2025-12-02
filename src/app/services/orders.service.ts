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
  getItems(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
  getItemsByInstance(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl+"/byInstance");
  }
  getItemsAllPerDay(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl+"/perDay");
  }
  getItemsByTable(dinerId:number): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl+"/byTable/"+dinerId);
  }
  getItemWithIncludes(id:number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}/WithIncludes`);
  }
  getItem(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
  createItem(item: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, item);
  }
  createPublicItem(items: Order[]): Observable<any> {
    return this.http.post<any>(environment.apiBase + 'PublicOrders', items);
  }
  updateItem(id: number, item: Order): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }
  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
