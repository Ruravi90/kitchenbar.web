import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DinersInterface } from '../interfaces/diners.interface';
import { AuthInterface } from '../interfaces';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DinersService implements DinersInterface{

  private apiUrl = environment.apiBase + 'diners';
  private currentUser:User = new User();
  constructor(private http: HttpClient, private auth: AuthInterface) {
      this.currentUser = auth.getCurrentUser();
   }
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getItemsByTable(identity:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+"/byTable/"+identity);
  }
  createItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }
  closeTicket(id: number): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/closeTicket/'+id,{});
  }
  updateItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }
  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
