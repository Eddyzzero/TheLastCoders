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
            this.authService.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
                console.log('État de connexion initial:', isLoggedIn);

                if (isLoggedIn) {
                    console.log('Utilisateur connecté, redirection vers /home');
                    this.router.navigate(['/home']);
                } else {
                    console.log('Utilisateur non connecté, redirection vers /login-choice');
                    this.router.navigate(['/login-choice']);
                }

                resolve(true);
            });
        });
    }
} 