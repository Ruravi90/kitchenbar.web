import { Observable } from "rxjs";

export abstract class DinersInterface{
    abstract getItems(): Observable<any[]>;
    abstract getItem(id: number): Observable<any>;
    abstract getItemsByTable(identity:string): Observable<any> ;
    abstract createItem(item: any): Observable<any>;
    abstract closeTicket(id: number): Observable<any>;
    abstract updateItem(id: number, item: any): Observable<any> ;
    abstract deleteItem(id: number): Observable<any>;
}