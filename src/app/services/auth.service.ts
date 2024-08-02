import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =  environment.apiBase + 'Auth';
  constructor(private http: HttpClient) { }
  
  login(model: User): Observable<boolean> {

    return this.http.post<any>(this.apiUrl + '/Login',model).pipe(
      map((response) => {
        // prepare the response to be handled, then return
        // we'll tidy up later
        // save in localStorage
        localStorage.setItem('user', JSON.stringify(response.resp));
        return response.resp;
      })
    );

  }

  getToken(): string{
    if (localStorage.getItem('user')) {
      const currentUser = JSON.parse(localStorage.getItem('user')!);
      return currentUser.token;
    }
    return '';
  }
  getCurrentUser(): any{
    if (localStorage.getItem('user')) {
      const currentUser = JSON.parse(localStorage.getItem('user')!);
      return currentUser;
    }
    return '';
  }
  checkLogin() : boolean{
    if (!localStorage.getItem('user')) {
        return false;
    }
    return true;
  }
}
