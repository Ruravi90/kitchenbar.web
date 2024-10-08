import { Observable } from "rxjs";
import { Category, Order } from "../models";

export abstract class OrdersInterface{
    abstract getItems(): Observable<any[]>;
    abstract getItemsByInstance(): Observable<any[]>;
    abstract getItemsAllPerDay(): Observable<any[]>;
    abstract getItemsByTable(dinerId:number): Observable<any[]> ;
    abstract getItemWithIncludes(id:number): Observable<Order>;
    abstract getItem(id: number): Observable<any>;
    abstract createItem(item: any): Observable<any>;
    abstract updateItem(id: number, item: any): Observable<any> ;
    abstract deleteItem(id: number): Observable<any>;
}