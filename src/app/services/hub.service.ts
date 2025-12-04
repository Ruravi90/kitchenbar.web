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
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry intervals
        .build();

        // Handle reconnection events
        this.hubConnection.onreconnecting((error) => {
            console.warn('SignalR reconnecting...', error);
        });

        this.hubConnection.onreconnected((connectionId) => {
            console.log('SignalR reconnected!', connectionId);
            // Rejoin group after reconnection
            if (currentUser) {
                this.joinGroup();
            }
        });

        this.hubConnection.onclose((error) => {
            console.error('SignalR connection closed', error);
        });

        this.hubConnection
        .start()
        .then(() => console.log('Connected to SignalR hub'))
        .catch(err => console.error('Error connecting to SignalR hub:', err));
    }
    
    // Helper method to safely invoke hub methods
    private async safeInvoke(methodName: string, ...args: any[]): Promise<void> {
        if (!this.hubConnection) {
            console.warn(`Hub connection not initialized. Cannot invoke ${methodName}`);
            return;
        }

        if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
            console.warn(`Hub connection not in Connected state (current: ${this.hubConnection.state}). Cannot invoke ${methodName}`);
            return;
        }

        try {
            await this.hubConnection.invoke(methodName, ...args);
        } catch (error) {
            console.error(`Error invoking ${methodName}:`, error);
        }
    }

    joinGroup() {
        const currentUser = JSON.parse(localStorage.getItem('user')!);
        this.safeInvoke('JoinGroup', currentUser.instance.identity, currentUser.user_name);
    }
    
    joinGroupAnonymus(identity:string) {
        this.safeInvoke('JoinGroup', identity, "Anonymus");
    }
    
    leaveGroup() {
        const currentUser = JSON.parse(localStorage.getItem('user')!);
        this.safeInvoke('LeaveGroup', currentUser.instance.identity, currentUser.user_name);
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
    sendOrder(object:any, instanceIdentity?: string) {
        let identity = instanceIdentity;
        if (!identity) {
            const currentUser = JSON.parse(localStorage.getItem('user')!);
            if (currentUser && currentUser.instance) {
                identity = currentUser.instance.identity;
            }
        }
        
        if (identity) {
            this.safeInvoke('SendOrder', identity, object);
        } else {
            console.error("Cannot send order: Instance identity not found.");
        }
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
      this.safeInvoke('SendNotificacionTables', currentUser.instance.identity, table);
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
