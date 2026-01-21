// Models for Reservation System

export interface AvailabilityRequest {
  branchIdentity: string;
  partySize: number;
  dateTime: string; // ISO string
}

export interface AvailabilityResponse {
  available: boolean;
  message: string;
  availableTables?: TableOption[];
  estimatedWaitMinutes?: number;
  offerWaitlist?: boolean;
  suggestedAlternatives?: AlternativeTime[];
}

export interface TableOption {
  id: number;
  number: string;
  capacity: string;
  location: string;
}

export interface AlternativeTime {
  dateTime: string;
  label: string;
}

export interface CreateReservationRequest {
  branchIdentity: string;
  partySize: number;
  dateTime: string; // ISO string
  preferredTableId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredLocation?: TableLocation;
  specialRequests?: string;
  preOrderItems?: PreOrderItemRequest[];
}

export interface PreOrderItemRequest {
  mealId: number;
  quantity: number;
  comment?: string;
}

export interface ReservationResponse {
  id: number;
  confirmationNumber: string;
  status: ReservationStatus;
  tableNumber?: string;
  message: string;
  estimatedWaitMinutes?: number;
}

export interface Reservation {
  id: number;
  tableId?: number;
  branchId: number;
  clientUserId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  reservationDateTime: string;
  status: ReservationStatus;
  preferredLocation?: TableLocation;
  specialRequests?: string;
  estimatedWaitMinutes?: number;
  createdAt: string;
  confirmedAt?: string;
  seatedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  hasPreOrder: boolean;
  preOrderTotal?: number;
  table?: any;
  preOrderItems?: any[];
}

export enum ReservationStatus {
  Pending = 0,
  Confirmed = 1,
  Waitlist = 2,
  Seated = 3,
  InProgress = 4,
  Completed = 5,
  Cancelled = 6,
  NoShow = 7
}

export enum TableLocation {
  Interior = 0,
  Terrace = 1,
  Bar = 2,
  VIP = 3,
  Private = 4
}
