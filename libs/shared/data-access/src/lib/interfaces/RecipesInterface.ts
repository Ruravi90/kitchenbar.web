import { Observable } from "rxjs";
import { Recipe } from "../models/Recipe";

export abstract class RecipesInterface {
    abstract getByMeal(mealId: number): Observable<Recipe[]>;
    abstract createItem(item: Recipe): Observable<Recipe>;
    abstract updateItem(id: number, item: Recipe): Observable<Recipe>;
    abstract deleteItem(id: number): Observable<void>;
}
