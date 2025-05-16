import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { Router, RouterModule } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';
  currentYear: number = new Date().getFullYear();

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.errorMessage = '';

      this.authService.login(email, password).subscribe({
        next: () => {
          console.log('Connexion réussie');
          this.router.navigate(['/home']);
        },
        error: (error: FirebaseError) => {
          console.error('Erreur lors de la connexion:', error);

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