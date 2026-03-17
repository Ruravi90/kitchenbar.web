import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@kitchenbar/shared-data-access';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router,public auth: AuthService) {}


  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // Check if we are already on a login page to avoid infinite redirect loops
    const isLoginPage = this.router.url.includes('/auth/login') || this.router.url.includes('/login');
    
    if (err.status === 401 && !isLoginPage) {
        // Clear expired session
        this.auth.logout();
        
        // Redirect to login
        // Using /auth/login as it seems to be the main login for Admin
        this.router.navigateByUrl(`/auth/login`);
        
        // Return throwError so downstream code (components, services) doesn't try to continue with bad data
        return throwError(() => err);
    }
    return throwError(() => err);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const startTime = Date.now();
    let status: string;
    let headers = req.headers
        .set('Authorization', `Bearer ${this.auth.getToken()}`);

    if (!(req.body instanceof FormData)) {
        headers = headers.set('Content-Type', 'application/json');
    }

    req = req.clone({ headers });

    return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
  }
}