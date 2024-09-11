import { Observable } from "rxjs";
import { Category, Order, Table } from "../models";

export abstract class HubInterface{
    abstract connect():void;
    abstract joinGroup():void;
    abstract joinGroupAnonymus(identity:string):void;
    abstract leaveGroup():void;
    abstract newUser(): Observable<string>;
    abstract leftUser(): Observable<string>;
    abstract sendOrder(order:Order):void;
    abstract sendNotificationTables(table:Table): void;
    abstract receiveOrderToKitchen(): Observable<Order>;
    abstract receiveOrderFromTable(): Observable<Order>;
    abstract notificationWarnTables(): Observable<Table>;
    abstract notificationDangerTables(): Observable<Table>;
}