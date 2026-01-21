import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AvailabilityRequest,
  AvailabilityResponse,
  CreateReservationRequest,
  ReservationResponse,
  Reservation
} from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiBase}Reservations`;

  constructor(private http: HttpClient) {}

  /**
   * Check table availability for given parameters
   */
  checkAvailability(request: AvailabilityRequest): Observable<AvailabilityResponse> {
    return this.http.post<AvailabilityResponse>(
      `${this.apiUrl}/check-availability`,
      request
    );
  }

  /**
   * Create a new reservation
   */
  createReservation(request: CreateReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(this.apiUrl, request);
  }

  /**
   * Get reservation by ID
   */
  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get reservations by phone number
   */
  getReservationsByPhone(phoneNumber: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/phone/${phoneNumber}`);
  }

  /**
   * Confirm customer arrival (staff only)
   */
  confirmArrival(reservationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${reservationId}/confirm-arrival`, {});
  }

  /**
   * Cancel a reservation
   */
  cancelReservation(reservationId: number, reason?: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${reservationId}/cancel`,
      { reason }
    );
  }

  /**
   * Get today's reservations for a branch (staff only)
   */
  getTodaysReservations(branchId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/branch/${branchId}/today`);
  }
}
