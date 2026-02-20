import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../tokens/environment.token';
import { MealsInterface } from '../interfaces/meals.interface';
import { AuthInterface } from '../interfaces';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService{
  private env = inject(ENVIRONMENT_TOKEN);

  private apiUrl = this.env.apiBase + 'Notifications';
  private currentUser:User = new User();
  constructor(private http: HttpClient, private auth: AuthInterface) {
      this.currentUser = auth.getCurrentUser();
   }
  send(VapidDetails:any): Observable<any> {
    return this.http.post<any[]>(this.apiUrl+"/send",VapidDetails);
  }
}
