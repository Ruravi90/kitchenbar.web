import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENVIRONMENT_TOKEN } from '../tokens/environment.token';
import { Membership, Instance } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private env = inject(ENVIRONMENT_TOKEN);

  constructor(private http: HttpClient) { }

  // Licenses
  getLicenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.env.apiBase}licenses`);
  }

  getLicense(id: number): Observable<any> {
    return this.http.get<any>(`${this.env.apiBase}licenses/${id}`);
  }

  createLicense(license: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiBase}licenses`, license);
  }

  updateLicense(id: number, license: any): Observable<any> {
    return this.http.put<any>(`${this.env.apiBase}licenses/${id}`, license);
  }

  deleteLicense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.env.apiBase}licenses/${id}`);
  }

  // Packages
  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.env.apiBase}packages`);
  }

  getPackage(id: number): Observable<any> {
    return this.http.get<any>(`${this.env.apiBase}packages/${id}`);
  }

  createPackage(pkg: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiBase}packages`, pkg);
  }

  updatePackage(id: number, pkg: any): Observable<any> {
    return this.http.put<any>(`${this.env.apiBase}packages/${id}`, pkg);
  }

  deletePackage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.env.apiBase}packages/${id}`);
  }

  // Promotions
  getPromotions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.env.apiBase}promotions`);
  }

  getPromotion(id: number): Observable<any> {
    return this.http.get<any>(`${this.env.apiBase}promotions/${id}`);
  }

  createPromotion(promo: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiBase}promotions`, promo);
  }

  updatePromotion(id: number, promo: any): Observable<any> {
    return this.http.put<any>(`${this.env.apiBase}promotions/${id}`, promo);
  }

  deletePromotion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.env.apiBase}promotions/${id}`);
  }

  // Memberships
  getMemberships(): Observable<Membership[]> {
    return this.http.get<Membership[]>(`${this.env.apiBase}memberships`);
  }

  getMembership(id: number): Observable<Membership> {
    return this.http.get<Membership>(`${this.env.apiBase}memberships/${id}`);
  }

  createMembership(membership: Membership): Observable<Membership> {
    return this.http.post<Membership>(`${this.env.apiBase}memberships`, membership);
  }

  updateMembership(id: number, membership: Membership): Observable<Membership> {
    return this.http.put<Membership>(`${this.env.apiBase}memberships/${id}`, membership);
  }

  deleteMembership(id: number): Observable<any> {
    return this.http.delete<any>(`${this.env.apiBase}memberships/${id}`);
  }

  // Instances
  getInstances(): Observable<Instance[]> {
    return this.http.get<Instance[]>(`${this.env.apiBase}instances`);
  }
}
