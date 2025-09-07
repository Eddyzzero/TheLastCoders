import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './fireAuth.service';
import { FirestoreService } from './firestore.service';
import { take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InitialNavigationService {
    private router = inject(Router);
    private authService = inject(AuthService);
    private firestoreService = inject(FirestoreService<any>);

    /**
     * Initialise le service et décide de la redirection initiale
     * Vérifie si l'utilisateur a complété le quiz avant de rediriger
     */
    initializeNavigation(): Promise<boolean> {
        return new Promise((resolve) => {
            // Vérifier d'abord l'état actuel
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
                this.checkUserQuizStatus(currentUser.uid).then(() => resolve(true));
                return;
            }

            // Si pas d'utilisateur actuel, attendre la réponse de Firebase
            this.authService.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
                if (isLoggedIn) {
                    const user = this.authService.getCurrentUser();
                    if (user) {
                        this.checkUserQuizStatus(user.uid).then(() => resolve(true));
                    } else {
                        this.router.navigate(['/login-choice']);
                        resolve(true);
                    }
                } else {
                    this.router.navigate(['/login-choice']);
                    resolve(true);
                }
            });
        });
    }

    /**
     * Vérifie si l'utilisateur a complété le quiz de compétences
     * @param userId - ID de l'utilisateur
     */
    private async checkUserQuizStatus(userId: string): Promise<void> {
        try {
            // Attendre un peu pour s'assurer que l'inscription est terminée
            await new Promise(resolve => setTimeout(resolve, 500));

            // Vérifier si l'utilisateur a déjà complété le quiz
            const quizResponse = await this.firestoreService.getDocument(`quiz_responses/${userId}`);

            if (quizResponse) {
                // L'utilisateur a déjà complété le quiz, rediriger vers l'accueil
                this.router.navigate(['/home']);
            } else {
                // Nouvel utilisateur, rediriger vers le quiz
                this.router.navigate(['/skills']);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du quiz:', error);
            // En cas d'erreur, rediriger vers l'accueil par défaut
            this.router.navigate(['/home']);
        }
    }
} 