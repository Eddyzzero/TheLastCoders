import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { Router, RouterModule } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../core/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';
  currentYear: number = new Date().getFullYear();
  isLoading: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          // La redirection sera gérée par InitialNavigationService
          // qui vérifiera si l'utilisateur a complété le quiz
        },
        error: (error: FirebaseError) => {
          this.isLoading = false;

          switch (error.code) {
            case 'auth/invalid-email':
              this.errorMessage = 'L\'adresse email n\'est pas valide.';
              break;
            case 'auth/user-disabled':
              this.errorMessage = 'Ce compte a été désactivé.';
              break;
            case 'auth/user-not-found':
              this.errorMessage = 'Aucun compte n\'existe avec cet email.';
              break;
            case 'auth/wrong-password':
              this.errorMessage = 'Le mot de passe est incorrect.';
              break;
            case 'auth/invalid-credential':
              this.errorMessage = 'Email ou mot de passe incorrect.';
              break;
            default:
              this.errorMessage = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
          }
        }
      });
    }
  }


}