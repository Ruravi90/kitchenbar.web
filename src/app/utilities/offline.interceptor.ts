import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { OfflineService } from '../services/offline.service';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private offlineService = inject(OfflineService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isOnline = navigator.onLine;

    if (!isOnline && request.method === 'POST') {
      return from(this.offlineService.addToQueue(request.url, request.method, request.body)).pipe(
        switchMap(() => {
          // Return a fake successful response to keep the UI happy
          return of(new HttpResponse({ status: 200, body: { message: 'Offline: Queued for sync' } }));
        })
      );
    }

    return next.handle(request).pipe(
        catchError(error => {
            // Optional: Handle network errors that happen even if navigator says onLine
            // For now, we rely on the check above.
            return throwError(() => error);
        })
    );
  }
}
