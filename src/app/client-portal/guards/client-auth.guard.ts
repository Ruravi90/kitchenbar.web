import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ClientPortalService } from '../../services/client-portal.service';
import { map, take } from 'rxjs/operators';

export const clientAuthGuard: CanActivateFn = (route, state) => {
  const clientService = inject(ClientPortalService);
  const router = inject(Router);

  return clientService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        // Store intended destination for redirect after login
        const returnUrl = state.url;
        if (!returnUrl.includes('/login')) {
          localStorage.setItem('client_return_url', returnUrl);
        }
        router.navigate(['/client-portal/login']);
        return false;
      }
    })
  );
};
