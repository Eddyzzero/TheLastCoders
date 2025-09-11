import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/fireAuth.service';
import { InitialNavigationService } from '../services/initial-navigation.service';
import { map } from 'rxjs/operators';

/**
 * Guard d'authentification pour protéger les routes
 * 
 * Ce guard :
 * - Vérifie si l'utilisateur est connecté
 * - Redirige vers la page de connexion si non authentifié
 * - Autorise l'accès si l'utilisateur est connecté
 */
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const initialNavigationService = inject(InitialNavigationService);

  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};