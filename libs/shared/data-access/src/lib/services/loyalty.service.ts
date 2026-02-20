import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../tokens/environment.token';
import { LoyaltyMember } from '../models/loyalty-member.model';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  private env = inject(ENVIRONMENT_TOKEN);
  private apiUrl = `${this.env.apiBase}LoyaltyMembers`;

  constructor(private http: HttpClient) { }

  getByPhoneNumber(phoneNumber: string): Observable<LoyaltyMember> {
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get<LoyaltyMember>(`${this.apiUrl}/GetByPhone`, { params });
  }

  create(member: LoyaltyMember): Observable<LoyaltyMember> {
    return this.http.post<LoyaltyMember>(this.apiUrl, member);
  }

  addPoints(memberId: number, points: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${memberId}/AddPoints`, { points });
  }
}
