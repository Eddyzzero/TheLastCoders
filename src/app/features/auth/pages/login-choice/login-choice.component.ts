import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/fireAuth.service';


@Component({
  selector: 'app-login-choice',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './login-choice.component.html',
  styleUrl: './login-choice.component.css'
})
export class LoginChoiceComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  currentYear: number = new Date().getFullYear();

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté et le rediriger si nécessaire
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });

    // Mettre à jour les données utilisateur si disponible
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSignal.set({
          id: user.uid,
          email: user.email!,
          userName: user.displayName!,
          createdAt: new Date(),
        });
      } else {
        this.authService.currentUserSignal.set(null);
      }
    });
  }

  //if the user press logout === index
  logOut(): void {
    this.authService.logOut().subscribe(() => {
      // Rediriger vers la page login-choice après déconnexion
      this.router.navigate(['/login-choice']);
    });
  }
}
