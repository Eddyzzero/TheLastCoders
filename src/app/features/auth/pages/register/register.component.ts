import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserInterface } from '../../interfaces/user.interface';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService<any>);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup;
  errorMessage: string = '';
  currentYear: number = new Date().getFullYear();
  isLoading: boolean = false;

  constructor() {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(7)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSignal.set({
          id: user.uid,
          email: user.email!,
          userName: user.displayName!,
          role: 'reader' as 'reader',
          createdAt: new Date()
        });
      } else {
        this.authService.currentUserSignal.set(null);
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const email = this.registerForm.get('email')?.value;
      const userName = this.registerForm.get('userName')?.value;
      const password = this.registerForm.get('password')?.value;

      this.authService.register(email, userName, password)
        .subscribe({
          next: async (response) => {
            try {
              // Attendre que l'authentification soit complète (délai plus long)
              await new Promise(resolve => setTimeout(resolve, 500));

              // Vérifier si l'utilisateur est bien authentifié
              const currentUser = this.authService.getCurrentUser();

              if (!currentUser) {
                throw new Error('utilisateur non authentifié après l\'inscription');
              }

              // Créer l'objet utilisateur
              const userData: UserInterface = {
                id: response.user.uid,
                email: response.user.email!,
                userName: userName,
                createdAt: new Date(),
                role: 'reader',
                skills: [],
                socialLinks: {
                  github: '',
                  linkedin: '',
                  twitter: ''
                }
              };

              // met à jour le signal de l'utilisateur actuel
              this.authService.currentUserSignal.set(userData);

              // creation du document utilisateur
              await this.firestoreService.createDocument(`users/${response.user.uid}`, userData);

              // Attendre encore un peu pour s'assurer que tout est synchronisé
              await new Promise(resolve => setTimeout(resolve, 100));

              // Redirection directe vers le quiz pour les nouveaux utilisateurs
              this.router.navigate(['/skills']);

            } catch (error) {
              this.isLoading = false;
              this.errorMessage = 'Erreur lors de la création du compte. Veuillez réessayer.';
              // réinitialisation de l'état d'authentification et déconnexion en cas d'échec
              this.authService.currentUserSignal.set(null);
              this.authService.logOut().subscribe();
            }
          },
          error: (error) => {
            this.isLoading = false;
            if (error.code === 'auth/email-already-in-use') {
              this.errorMessage = 'Cette adresse email est déjà utilisée';
            } else {
              this.errorMessage = error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
            }
          }
        });
    }
  }
}
