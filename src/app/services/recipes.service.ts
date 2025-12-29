import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/Recipe';
import { RecipesInterface } from '../interfaces/RecipesInterface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipesService extends RecipesInterface {

  private apiUrl = `${environment.apiBase}Recipes`;

  constructor(private http: HttpClient) {
    super();
  }

  getByMeal(mealId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/meal/${mealId}`);
  }

  createItem(item: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, item);
  }

  updateItem(id: number, item: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
