import { Observable } from "rxjs";
import { Category, Table } from "../models";

export abstract class TablesInterface{
    abstract getItems(): Observable<any[]>;
    abstract getItem(id: number): Observable<any>;
    abstract request(entity:Table): Observable<any[]>
    abstract getByIdentity(identity: string): Observable<any>;
    abstract createItem(item: any): Observable<any>;
    abstract updateItem(id: number, item: any): Observable<any> ;
    abstract deleteItem(id: number): Observable<any>;
}