import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MealsInterface } from '../interfaces/meals.interface';

@Injectable({
  providedIn: 'root'
})
export class MealsService implements MealsInterface{

  private apiUrl = environment.apiBase + 'meals';
  constructor(private http: HttpClient) { }
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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
