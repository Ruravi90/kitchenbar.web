import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../tokens/environment.token';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private env = inject(ENVIRONMENT_TOKEN);
  private apiUrl = this.env.apiBase + 'Dashboard';

  constructor(private http: HttpClient) { }

  getDailySales(branchId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sales`, { params: { branchId: branchId.toString() } });
  }

  getTopSellingItems(branchId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-items`, { params: { branchId: branchId.toString() } });
  }

  getPeakHours(branchId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/peak-hours`, { params: { branchId: branchId.toString() } });
  }

  getLicenseStatus(instanceId?: number): Observable<any> {
    const params: any = {};
    if (instanceId) params.instanceId = instanceId.toString();
    return this.http.get<any>(`${this.apiUrl}/license-status`, { params });
  }
}
