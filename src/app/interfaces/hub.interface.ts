import { Observable } from "rxjs";
import { Category, Order } from "../models";

export abstract class HubInterface{
    abstract connect():void;
    abstract newUser(): Observable<string>;
    abstract leftUser(): Observable<string>;
    abstract receiveOrderToKitchen(): Observable<Order>;
}