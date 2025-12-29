import { Observable } from "rxjs";
import { Inventory } from "../models/inventory.model";

export abstract class InventoryInterface {
    abstract getItems(): Observable<Inventory[]>;
    abstract getItemsByInstance(): Observable<Inventory[]>;
    abstract getItem(id: number): Observable<Inventory>;
    abstract createItem(item: Inventory): Observable<Inventory>;
    abstract updateItem(id: number, item: Inventory): Observable<Inventory>;
    abstract deleteItem(id: number): Observable<void>;
    abstract predict(days?: number): Observable<any[]>;
    abstract recordWaste(item: any): Observable<any>;
}
