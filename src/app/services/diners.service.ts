import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DinersInterface } from '../interfaces/diners.interface';
import { AuthInterface } from '../interfaces';
import { User, Diner } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DinersService implements DinersInterface{

  private apiUrl = environment.apiBase + 'diners';
  private currentUser:User = new User();
  constructor(private http: HttpClient, private auth: AuthInterface) {
      this.currentUser = auth.getCurrentUser();
   }
  getItems(): Observable<Diner[]> {
    return this.http.get<Diner[]>(this.apiUrl);
  }
  getItem(id: number): Observable<Diner> {
    return this.http.get<Diner>(`${this.apiUrl}/${id}`);
  }
  getItemsByTable(identity:string): Observable<Diner[]> {
    return this.http.get<Diner[]>(this.apiUrl+"/byTable/"+identity);
  }
  createItem(item: Diner): Observable<Diner> {
    return this.http.post<Diner>(this.apiUrl, item);
  }
  closeTicket(id: number): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/closeTicket/'+id,{});
  }
  updateItem(id: number, item: Diner): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }
  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
