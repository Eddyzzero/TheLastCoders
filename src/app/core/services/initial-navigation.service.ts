import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './fireAuth.service';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InitialNavigationService {
    private router = inject(Router);
    private authService = inject(AuthService);

    /**
     * Initialise le service et décide de la redirection initiale
     */
    initializeNavigation(): Promise<boolean> {
        return new Promise((resolve) => {
            // Vérifier d'abord l'état actuel
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
                this.router.navigate(['/home']);
                resolve(true);
                return;
            }

            // Si pas d'utilisateur actuel, attendre la réponse de Firebase
            this.authService.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
                if (isLoggedIn) {
                    this.router.navigate(['/home']);
                } else {
                    this.router.navigate(['/login-choice']);
                }
                resolve(true);
            });
        });
    }
} 