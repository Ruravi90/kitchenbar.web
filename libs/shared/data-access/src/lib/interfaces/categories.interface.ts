import { Observable } from "rxjs";
import { Category } from "../models";

export abstract class CategoriesInterface{
    abstract getItems(): Observable<any[]>;
    abstract getItem(id: number): Observable<any>;
    abstract getItemsByInstance(): Observable<any[]>;
    abstract getItemsByInstanceId(instanceId: number): Observable<any[]>;
    abstract getPublic(identity: string): Observable<any[]>;
    abstract createItem(item: any): Observable<any>;
    abstract updateItem(id: number, item: any): Observable<any> ;
    abstract deleteItem(id: number): Observable<any>;
}