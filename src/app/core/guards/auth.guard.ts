import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/fireAuth.service';
import { map } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      console.log('AuthGuard: isLoggedIn =', isLoggedIn);
      if (!isLoggedIn) {
        console.log('AuthGuard: Redirecting to login');
        router.navigate(['/login']);
        return false;
      }
      console.log('AuthGuard: Access granted');
      return true;
    })
  );
};