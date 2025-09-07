import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/fireAuth.service';
import { map } from 'rxjs/operators';
import { UserInterface } from '../../features/auth/interfaces/user.interface';

/**
 * Guard qui vérifie si l'utilisateur a complété le formulaire de quiz
 * 
 * Ce guard :
 * - Vérifie si l'utilisateur est connecté et a rempli le quiz
 * - Redirige vers la page du quiz si non complété
 * - Autorise l'accès si le quiz est complété
 */
export const quizCompletionGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        map((user) => {
            // Vérifier si l'utilisateur existe et a déjà complété le quiz
            const currentUser = authService.currentUserSignal();
            if (!currentUser || !currentUser.skills || currentUser.skills.length === 0) {
                router.navigate(['/skills']);
                return false;
            }
            return true;
        })
    );
};
