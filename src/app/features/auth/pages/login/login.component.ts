import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
//TODO :
//creer le composant login qui permettra de se connecter
export class LoginComponent {
  [x: string]: any;
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  };

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.isLoading = true;
    this.error = null;

    this.authService.login(email, password)
      .pipe(
        catchError(error => {
          this.error = this.getErrorMessage(error);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(credential => {
        if (credential) {
          this.router.navigateByUrl(this.returnUrl);
        }
      });
  }

  forgotPassword() {
    this.router.navigate(['/auth/reset-password']);
  }

  private getErrorMessage(error: any): string {
    switch (error?.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Email ou mot de passe incorrect.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
      default:
        return 'Une erreur s\'est produite. Veuillez réessayer.';
    }
  }
}