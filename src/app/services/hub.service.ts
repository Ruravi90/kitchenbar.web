import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Observable, Subject} from "rxjs";
import { environment } from '../../environments/environment';
import { Order } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HubService {
    private hubConnection?: signalR.HubConnection;

    constructor() {

    }

    connect(): void{
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${environment.hubBase}/orders`, {
            withCredentials: sessionStorage.getItem('token') != null,
            accessTokenFactory: () => {
            let token = sessionStorage.getItem('token');
                return token ?? '';
            },
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
        }) // Replace with your SignalR hub URL
        .build();

        this.hubConnection
        .start()
        .then(() => console.log('Connected to SignalR hub'))
        .catch(err => console.error('Error connecting to SignalR hub:', err));

    }

    newUser(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection?.on('NewUser', (message: string) => {
            observer.next(message);
            });
        });
    }
    leftUser(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection?.on('LeftUser', (message: string) => {
            observer.next(message);
            });
        });
    }
    receiveOrderToKitchen(): Observable<Order> {
        return new Observable<Order>((observer) => {
            this.hubConnection?.on('ReceiveOrderToKitchen', (order: Order) => {
            observer.next(order);
            });
        });
    }



}