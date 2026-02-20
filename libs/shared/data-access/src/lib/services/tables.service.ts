import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../tokens/environment.token';
import { Table, User } from '../models';
import { AuthInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  private env = inject(ENVIRONMENT_TOKEN);

  private apiUrl = this.env.apiBase + 'tables';
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
    item.instanceId = this.currentUser.instanceId;
    return this.http.post<any>(this.apiUrl, item);
  }
  updateItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }
  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
