import { Observable } from "rxjs";
import { Meal } from "../models";

export abstract class MealsInterface{
    abstract getItems(): Observable<any[]>;
    abstract getItem(id: number): Observable<any>;
    abstract createItem(item: any): Observable<any>;
    abstract updateItem(id: number, item: any): Observable<any> ;
    abstract deleteItem(id: number): Observable<any>;
}