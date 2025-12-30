import { Order, Table, Diner } from '../models';

/**
 * Type-safe interfaces for SignalR message payloads
 */

export interface OrderMessage {
  id?: number;
  dinerId?: number;
  mealId?: number;
  tableId?: number;
  branchId?: number;
  instanceId?: number;
  clientUserId?: number;
  userId?: number;
  quantity?: number;
  aditional?: string;
  statusOrderId?: number;
  isCancel?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  meal?: any;
  table?: any;
  diner?: any;
}

export interface DinerMessage {
  id?: number;
  tableId?: number;
  clientUserId?: number;
  name_client?: string;
  correo?: string;
  phone_number?: string;
  orderType?: string;
  pickupTime?: Date | string;
  deliveryAddress?: string;
  isPay?: boolean;
  loyaltyMemberId?: number;
  createdAt?: Date | string;
  orders?: Order[];
  table?: any;
}

export interface TableNotification {
  id: number;
  name?: string;
  identity?: string;
  isRequestAttendace?: boolean;
  isRequestCheck?: boolean;
  isBusy?: boolean;
  branchId?: number;
  instanceId?: number;
}

export interface UserMessage {
  type: string;
  message: string;
}

/**
 * SignalR connection states
 */
export enum HubConnectionState {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Disconnecting = 'Disconnecting',
  Reconnecting = 'Reconnecting'
}
