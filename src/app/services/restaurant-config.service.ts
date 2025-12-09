import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RestaurantConfig } from '../models/restaurant-config.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantConfigService {

  constructor(private http: HttpClient) { }

  getConfig() {
    return this.http.get<RestaurantConfig>(`${environment.apiBase}RestaurantConfig`);
  }

  updateConfig(config: RestaurantConfig) {
    return this.http.put<RestaurantConfig>(`${environment.apiBase}RestaurantConfig`, config);
  }

  onboardStripe() {
    return this.http.post<{ url: string }>(`${environment.apiBase}connect/onboard`, {});
  }

  getStripeStatus() {
    return this.http.get<{ connected: boolean, accountId?: string, chargesEnabled?: boolean, detailsSubmitted?: boolean }>(`${environment.apiBase}connect/status`);
  }
}
