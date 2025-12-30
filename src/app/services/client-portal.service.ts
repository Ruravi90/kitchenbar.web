import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClientUser, ClientAddress, LoginResponse } from '../interfaces/client-portal.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientPortalService {
  private apiUrl = environment.apiBase;
  private currentUserSubject = new BehaviorSubject<ClientUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const user = localStorage.getItem('client_user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // Auth
  login(credentials: { email: string, password: string }): Observable<any> {
    // Backend expects 'user_name' field (which is the email for clients)
    const loginData = {
      user_name: credentials.email,
      password: credentials.password
    };
    return this.http.post<any>(`${this.apiUrl}ClientAuth/login`, loginData)
      .pipe(tap(response => {
        // Backend returns token directly in response, not in response.data
        if (response.code === 200 && response.token) {
            localStorage.setItem('client_token', response.token);
            // Store user data (extract from response)
            const user = {
              id: response.id,
              name: response.name,
              email: response.email,
              phoneNumber: '' // Not returned in login response
            };
            localStorage.setItem('client_user', JSON.stringify(user));
            this.currentUserSubject.next(user);
        }
      }));
  }

  register(user: Partial<ClientUser> & { password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}ClientAuth/register`, user);
  }

  logout() {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_user');
    this.currentUserSubject.next(null);
  }

  // Interaction
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}ClientInteraction/favorites`);
  }

  addFavorite(branchId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}ClientInteraction/favorites/${branchId}`, {});
  }

  removeFavorite(branchId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}ClientInteraction/favorites/${branchId}`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}ClientInteraction/cancel-order/${orderId}`, {});
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}ClientInteraction/history`);
  }

  getAddresses(): Observable<ClientAddress[]> {
    return this.http.get<ClientAddress[]>(`${this.apiUrl}ClientInteraction/addresses`);
  }

  addAddress(address: ClientAddress): Observable<ClientAddress> {
    return this.http.post<ClientAddress>(`${this.apiUrl}ClientInteraction/addresses`, address);
  }

  // NEW: QR-based interactions
  linkBranch(branchIdentity: string): Observable<any> {
    return this.http.post(`${this.apiUrl}ClientInteraction/link-branch`, {
      branchIdentity
    });
  }

  checkinTable(tableIdentity: string, notes?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}ClientInteraction/checkin-table`, {
      tableIdentity,
      notes
    }).pipe(
      tap((response: any) => {
        if (response.dinerId) {
          localStorage.setItem('currentDinerId', response.dinerId);
        }
      })
    );
  }


  getActiveSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}ClientInteraction/active-session`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('client_token');
  }
}
