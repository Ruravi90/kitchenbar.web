import { Observable } from "rxjs";
import { Category, Order, Table } from "../models";

export abstract class HubInterface{
    abstract connect():void;
    abstract joinGroup():void;
    abstract joinGroupAnonymus(identity:string):void;
    abstract leaveGroup():void;
    abstract newUser(): Observable<string>;
    abstract leftUser(): Observable<string>;
    abstract sendOrder(object:any, instanceIdentity?: string):void;
    abstract sendNotificationTables(table:Table): void;
    abstract receiveOrderToKitchen(): Observable<any>;
    abstract receiveOrderFromTable(): Observable<any>;
    abstract notificationWarnTables(): Observable<Table>;
    abstract notificationDangerTables(): Observable<Table>;
}
