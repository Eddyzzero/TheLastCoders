import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { FirebaseError } from 'firebase/app';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService<any>);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm: FormGroup;
  errorMessage: string = '';

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
        // Créer l'objet utilisateur
        const userData = {
          id: user.uid,
          email: user.email!,
          userName: user.displayName!,
          createdAt: new Date(),
        };

        // Mettre à jour le signal
        this.authService.currentUserSignal.set(userData);

        // Sauvegarder dans Firestore
        this.firestoreService.CreateDocument(`users/${user.uid}`, userData)
          .then(() => {
            console.log('Utilisateur enregistré dans Firestore');
          })
          .catch(error => {
            console.error('Erreur lors de l\'enregistrement utilisateur :', error);
          });
      } else {
        this.authService.currentUserSignal.set(null);
      }
      console.log(this.authService.currentUserSignal());
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, userName, password } = this.registerForm.value;
      this.errorMessage = '';

      this.authService.register(email, userName, password)
        .subscribe({
          next: () => {
            console.log('Inscription réussie');
            this.router.navigate(['/skills']);
          },
          error: (error: FirebaseError) => {
            console.error('Erreur lors de l\'inscription:', error);
            switch (error.code) {
              case 'auth/email-already-in-use':
                this.errorMessage = 'Cet email est déjà utilisé.';
                break;
              case 'auth/invalid-email':
                this.errorMessage = 'L\'adresse email n\'est pas valide.';
                break;
              case 'auth/operation-not-allowed':
                this.errorMessage = 'L\'inscription par email/mot de passe n\'est pas activée.';
                break;
              case 'auth/weak-password':
                this.errorMessage = 'Le mot de passe est trop faible.';
                break;
              default:
                this.errorMessage = 'Une erreur est survenue lors de l\'inscription.';
            }
          }
        });
    }
  }
}
