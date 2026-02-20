import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../tokens/environment.token';
import { RestaurantConfig } from '../models/restaurant-config.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantConfigService {
  private env = inject(ENVIRONMENT_TOKEN);

  constructor(private http: HttpClient) { }

  getConfig() {
    return this.http.get<RestaurantConfig>(`${this.env.apiBase}RestaurantConfig`);
  }

  updateConfig(config: RestaurantConfig) {
    return this.http.put<RestaurantConfig>(`${this.env.apiBase}RestaurantConfig`, config);
  }

  onboardStripe() {
    return this.http.post<{ url: string }>(`${this.env.apiBase}connect/onboard`, {});
  }

  getStripeStatus() {
    return this.http.get<{ connected: boolean, accountId?: string, chargesEnabled?: boolean, detailsSubmitted?: boolean }>(`${this.env.apiBase}connect/status`);
  }
}
