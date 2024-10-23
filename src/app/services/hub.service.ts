import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Observable, Subject} from "rxjs";
import { environment } from '../../environments/environment';
import { Order, Table } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderHubService {
    private hubConnection?: signalR.HubConnection;
    constructor() {
    }
    connect(): void{
        const currentUser = JSON.parse(localStorage.getItem('user')!);
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${environment.hubBase}`, {
        //    accessTokenFactory: () => {
        //        let token = currentUser.token;
        //        return token ?? '';
        //    }
        }) // Replace with your SignalR hub URL
        .withAutomaticReconnect()
        .build();

        this.hubConnection
        .start()
        .then(() => console.log('Connected to SignalR hub'))
        .catch(err => console.error('Error connecting to SignalR hub:', err));

    }
    joinGroup() {
        const currentUser = JSON.parse(localStorage.getItem('user')!);
        this.hubConnection?.invoke('JoinGroup',currentUser.instance.identity,currentUser.user_name);
    }
    joinGroupAnonymus(identity:string) {
        this.hubConnection?.invoke('JoinGroup',identity,"Anonymus");
    }
    leaveGroup() {
        const currentUser = JSON.parse(localStorage.getItem('user')!);
        this.hubConnection?.invoke('LeaveGroup',currentUser.instance.identity,currentUser.user_name);
    }
    newUser(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection?.on('NewUser', (type: string, message: string) => {
                console.log(type, message);
                observer.next(message);
            });
        });
    }
    leftUser(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection?.on('LeftUser', (type: string, message: string) => {
                console.log(type, message);
                observer.next(message);
            });
        });
    }
    sendOrder(object:any) {
        const currentUser = JSON.parse(localStorage.getItem('user')!);
        this.hubConnection?.invoke('SendOrder',currentUser.instance.identity,object);
    }

    receiveOrderToKitchen(): Observable<any> {
        return new Observable<Order>((observer) => {
            this.hubConnection?.on('ReceiveOrderToKitchen', result => {
                console.log("ReceiveOrderToKitchen",result)
                observer.next(result);
            });
        });
    }
    receiveOrderFromTable(): Observable<any> {
        return new Observable<Order>((observer) => {
            this.hubConnection?.on('ReceiveOrderFromTable', result => {
                console.log("ReceiveOrderFromTable",result)
                observer.next(result);
            });
        });
    }
    sendNotificationTables(table:Table): void {
      const currentUser = JSON.parse(localStorage.getItem('user')!);
      this.hubConnection?.invoke('SendNotificacionTables',currentUser.instance.identity,table);
    }
    notificationWarnTables(): Observable<Table> {
        return new Observable<Table>((observer) => {
            this.hubConnection?.on('NotificationWarnTables', (table: Table) => {
                observer.next(table);
            });
        });
    }
    notificationDangerTables(): Observable<Table> {
        return new Observable<Table>((observer) => {
            this.hubConnection?.on('NotificationDangerAttendace', (table: Table) => {
                observer.next(table);
            });
        });
    }


}
