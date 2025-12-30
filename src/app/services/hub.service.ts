import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from "rxjs";
import { environment } from '../../environments/environment';
import { Order, Table } from '../models';
import { 
  OrderMessage, 
  DinerMessage, 
  TableNotification, 
  UserMessage,
  HubConnectionState 
} from '../interfaces/hub-messages';

@Injectable({
  providedIn: 'root'
})
export class OrderHubService {
  private hubConnection?: signalR.HubConnection;
  private messageQueue: { method: string; args: any[] }[] = [];
  private connectionStateSubject = new Subject<HubConnectionState>();
  
  public connectionState$ = this.connectionStateSubject.asObservable();

  constructor() {}

  /**
   * Establishes connection to SignalR hub with automatic reconnection
   */
  connect(): void {
    const currentUser = JSON.parse(localStorage.getItem('user')!);
    
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubBase}`, {
        // Uncomment if JWT authentication is needed
        // accessTokenFactory: () => currentUser?.token ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry intervals
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Connection state handlers
    this.hubConnection.onreconnecting((error) => {
      console.warn('SignalR reconnecting...', error);
      this.connectionStateSubject.next(HubConnectionState.Reconnecting);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected!', connectionId);
      this.connectionStateSubject.next(HubConnectionState.Connected);
      
      // Rejoin group after reconnection
      if (currentUser) {
        this.joinGroup();
      }
      
      // Process queued messages
      this.processMessageQueue();
    });

    this.hubConnection.onclose((error) => {
      console.error('SignalR connection closed', error);
      this.connectionStateSubject.next(HubConnectionState.Disconnected);
    });

    // Start connection
    this.connectionStateSubject.next(HubConnectionState.Connecting);
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connected to SignalR hub');
        this.connectionStateSubject.next(HubConnectionState.Connected);
        this.processMessageQueue();
      })
      .catch(err => {
        console.error('Error connecting to SignalR hub:', err);
        this.connectionStateSubject.next(HubConnectionState.Disconnected);
      });
  }

  /**
   * Disconnects from SignalR hub explicitly
   */
  async disconnect(): Promise<void> {
    if (this.hubConnection) {
      this.connectionStateSubject.next(HubConnectionState.Disconnecting);
      try {
        await this.hubConnection.stop();
        console.log('SignalR connection stopped');
        this.connectionStateSubject.next(HubConnectionState.Disconnected);
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }

  /**
   * Gets the current connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.hubConnection?.state ?? null;
  }

  /**
   * Helper method to safely invoke hub methods with queueing
   */
  private async safeInvoke(methodName: string, ...args: any[]): Promise<void> {
    if (!this.hubConnection) {
      console.warn(`Hub connection not initialized. Cannot invoke ${methodName}`);
      return;
    }

    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn(`Hub connection not in Connected state (current: ${this.hubConnection.state}). Queueing ${methodName}`);
      this.messageQueue.push({ method: methodName, args });
      return;
    }

    try {
      await this.hubConnection.invoke(methodName, ...args);
    } catch (error) {
      console.error(`Error invoking ${methodName}:`, error);
      // Requeue the message on error
      this.messageQueue.push({ method: methodName, args });
    }
  }

  /**
   * Processes queued messages after reconnection
   */
  private async processMessageQueue(): Promise<void> {
    if (this.messageQueue.length === 0) return;

    console.log(`Processing ${this.messageQueue.length} queued messages`);
    const queue = [...this.messageQueue];
    this.messageQueue = [];

    for (const message of queue) {
      await this.safeInvoke(message.method, ...message.args);
    }
  }

  /**
   * Joins the current user's instance group
   */
  joinGroup(): void {
    const currentUser = JSON.parse(localStorage.getItem('user')!);
    if (currentUser?.instance?.identity) {
      this.safeInvoke('JoinGroup', currentUser.instance.identity, currentUser.user_name);
    }
  }

  /**
   * Joins a group anonymously (for public users)
   */
  joinGroupAnonymus(identity: string): void {
    this.safeInvoke('JoinGroup', identity, "Anonymous");
  }

  /**
   * Leaves the current user's group
   */
  leaveGroup(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const currentUser = JSON.parse(userStr);
    if (!currentUser?.instance?.identity) return;

    this.safeInvoke('LeaveGroup', currentUser.instance.identity, currentUser.user_name);
  }

  /**
   * Observable for new user join notifications
   */
  newUser(): Observable<UserMessage> {
    return new Observable<UserMessage>((observer) => {
      this.hubConnection?.on('NewUser', (type: string, message: string) => {
        console.log('NewUser:', type, message);
        observer.next({ type, message });
      });
    });
  }

  /**
   * Observable for user leave notifications
   */
  leftUser(): Observable<UserMessage> {
    return new Observable<UserMessage>((observer) => {
      this.hubConnection?.on('LeftUser', (type: string, message: string) => {
        console.log('LeftUser:', type, message);
        observer.next({ type, message });
      });
    });
  }

  /**
   * Sends an order notification to a group
   * @param object - Order data or any object to send
   * @param instanceIdentity - Optional instance identity, will use current user's if not provided
   */
  sendOrder(object: any, instanceIdentity?: string): void {
    let identity = instanceIdentity;
    
    if (!identity) {
      const currentUser = JSON.parse(localStorage.getItem('user')!);
      identity = currentUser?.instance?.identity;
    }

    if (identity) {
      this.safeInvoke('SendOrder', identity, object);
    } else {
      console.error("Cannot send order: Instance identity not found.");
    }
  }

  /**
   * Observable for kitchen order notifications
   */
  receiveOrderToKitchen(): Observable<OrderMessage> {
    return new Observable<OrderMessage>((observer) => {
      this.hubConnection?.on('ReceiveOrderToKitchen', (result: OrderMessage) => {
        console.log("ReceiveOrderToKitchen", result);
        observer.next(result);
      });
    });
  }

  /**
   * Observable for table order notifications
   */
  receiveOrderFromTable(): Observable<OrderMessage> {
    return new Observable<OrderMessage>((observer) => {
      this.hubConnection?.on('ReceiveOrderFromTable', (result: OrderMessage) => {
        console.log("ReceiveOrderFromTable", result);
        observer.next(result);
      });
    });
  }

  /**
   * Sends a table notification
   */
  sendNotificationTables(table: Table): void {
    const currentUser = JSON.parse(localStorage.getItem('user')!);
    if (currentUser?.instance?.identity) {
      this.safeInvoke('SendNotificationTables', currentUser.instance.identity, table);
    }
  }

  /**
   * Observable for table warning notifications
   */
  notificationWarnTables(): Observable<TableNotification> {
    return new Observable<TableNotification>((observer) => {
      this.hubConnection?.on('NotificationWarnTables', (table: TableNotification) => {
        observer.next(table);
      });
    });
  }

  /**
   * Observable for table danger notifications
   */
  notificationDangerTables(): Observable<TableNotification> {
    return new Observable<TableNotification>((observer) => {
      this.hubConnection?.on('NotificationDangerAttendance', (table: TableNotification) => {
        observer.next(table);
      });
    });
  }
}
