import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Membership, Instance } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  // Licenses
  getLicenses(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBase}licenses`);
  }

  getLicense(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiBase}licenses/${id}`);
  }

  createLicense(license: any): Observable<any> {
    return this.http.post<any>(`${environment.apiBase}licenses`, license);
  }

  updateLicense(id: number, license: any): Observable<any> {
    return this.http.put<any>(`${environment.apiBase}licenses/${id}`, license);
  }

  deleteLicense(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiBase}licenses/${id}`);
  }

  // Packages
  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBase}packages`);
  }

  getPackage(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiBase}packages/${id}`);
  }

  createPackage(pkg: any): Observable<any> {
    return this.http.post<any>(`${environment.apiBase}packages`, pkg);
  }

  updatePackage(id: number, pkg: any): Observable<any> {
    return this.http.put<any>(`${environment.apiBase}packages/${id}`, pkg);
  }

  deletePackage(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiBase}packages/${id}`);
  }

  // Promotions
  getPromotions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBase}promotions`);
  }

  getPromotion(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiBase}promotions/${id}`);
  }

  createPromotion(promo: any): Observable<any> {
    return this.http.post<any>(`${environment.apiBase}promotions`, promo);
  }

  updatePromotion(id: number, promo: any): Observable<any> {
    return this.http.put<any>(`${environment.apiBase}promotions/${id}`, promo);
  }

  deletePromotion(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiBase}promotions/${id}`);
  }

  // Memberships
  getMemberships(): Observable<Membership[]> {
    return this.http.get<Membership[]>(`${environment.apiBase}memberships`);
  }

  getMembership(id: number): Observable<Membership> {
    return this.http.get<Membership>(`${environment.apiBase}memberships/${id}`);
  }

  createMembership(membership: Membership): Observable<Membership> {
    return this.http.post<Membership>(`${environment.apiBase}memberships`, membership);
  }

  updateMembership(id: number, membership: Membership): Observable<Membership> {
    return this.http.put<Membership>(`${environment.apiBase}memberships/${id}`, membership);
  }

  deleteMembership(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiBase}memberships/${id}`);
  }

  // Instances
  getInstances(): Observable<Instance[]> {
    return this.http.get<Instance[]>(`${environment.apiBase}instances`);
  }
}
