import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router,public auth: AuthService) {}


  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (!err.url?.includes("Login") && (err.status === 401) ) {
        //navigate /delete cookies or whatever
        this.router.navigateByUrl(`/auth/access`);
        // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
        return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError((() => err));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const startTime = Date.now();
    let status: string;
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
  }
}