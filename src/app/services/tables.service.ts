import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Table } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private apiUrl = environment.apiBase + 'tables';
  constructor(private http: HttpClient) { }
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getItemsByInstance(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/byInstance");
  }
  request(entity:Table): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl+"/request",entity);
  }

  getItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getByIdentity(identity: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/byIdentity/${identity}`);
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
