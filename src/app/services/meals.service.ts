import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MealsInterface } from '../interfaces/meals.interface';
import { AuthInterface } from '../interfaces';
import { User, Meal } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MealsService implements MealsInterface{

  private apiUrl = environment.apiBase + 'meals';
  private currentUser:User = new User();
  constructor(private http: HttpClient, private auth: AuthInterface) {
      this.currentUser = auth.getCurrentUser();
   }
  getItems(): Observable<Meal[]> {
    return this.http.get<Meal[]>(this.apiUrl);
  }
  getItemsByInstance(): Observable<Meal[]> {
    return this.http.get<Meal[]>(this.apiUrl+"/byInstance");
  }
  getPublic(identity: string): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.apiUrl}/public/${identity}`);
  }
  rate(id: number, rating: number): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/' + id + '/rate', rating);
  }
  getItem(id: number): Observable<Meal> {
    return this.http.get<Meal>(`${this.apiUrl}/${id}`);
  }
  createItem(item: Meal): Observable<Meal> {
    item.instanceId = this.currentUser.instanceId;
    return this.http.post<Meal>(this.apiUrl, item);
  }
  updateItem(id: number, item: Meal): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item);
  }
  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
