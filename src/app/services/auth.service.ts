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
  
  login(model: User): Observable<User> {

    return this.http.post<any>(this.apiUrl + '/Login',model).pipe(
      map((response) => {
        // prepare the response to be handled, then return
        // we'll tidy up later
        // save in localStorage
        localStorage.setItem('user', JSON.stringify(response));
        return response;
      })
    );

  }
  register(model: User): Observable<User> {
    model.instance!.correo = model.email;
    model.user_name = `${model.user_name}@${model.instance?.name_kitchen}`;
    return this.http.post<any>(this.apiUrl + '/Register',model).pipe(
      map((response) => {
        // prepare the response to be handled, then return
        // we'll tidy up later
        // save in localStorage
        localStorage.setItem('user', JSON.stringify(response));
        return response;
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
  getCurrentRol():number{
    if (localStorage.getItem('user')) {
      const currentUser = JSON.parse(localStorage.getItem('user')!);
      return currentUser.role;
    }
    return 0;
  }
}
