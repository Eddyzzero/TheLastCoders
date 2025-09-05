import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/fireAuth.service';
import { map } from 'rxjs/operators';

// guard de redirection à home si pas de authentification
export const authRedirectGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn$.pipe(
        map(isLoggedIn => {
            if (isLoggedIn) {
                router.navigate(['/home']);
                return false;
            }
            return true;
        })
    );
}; 