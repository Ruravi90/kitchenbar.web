import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';
import { AuthInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private apiUrl = environment.apiBase + 'categories';
  private currentUser:User = new User();
  constructor(private http: HttpClient, private auth: AuthInterface) {
      this.currentUser = auth.getCurrentUser();
   }
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getItemsByInstance(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/ByInstance");
  }
  getItemsByInstanceId(instanceId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+"/ByInstanceId/"+instanceId);
  }
  getPublic(identity: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/public/${identity}`);
  }
  getItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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
