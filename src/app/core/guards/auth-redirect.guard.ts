import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/fireAuth.service';
import { map } from 'rxjs/operators';

/**
 * Guard de redirection pour les utilisateurs déjà authentifiés
 * 
 * Ce guard :
 * - Vérifie si l'utilisateur est déjà connecté
 * - Redirige vers la page d'accueil si déjà authentifié
 * - Autorise l'accès aux pages de connexion/inscription si non authentifié
 */
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