import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserInterface } from '../../interfaces/user.interface';

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
  currentYear: number = new Date().getFullYear();

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
      const email = this.registerForm.get('email')?.value;
      const userName = this.registerForm.get('userName')?.value;
      const password = this.registerForm.get('password')?.value;

      this.authService.register(email, userName, password)
        .subscribe({
          next: async (response) => {
            try {
              // Attendre que l'authentification soit complète
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Vérifier si l'utilisateur est bien authentifié
              const currentUser = this.authService.getCurrentUser();

              if (!currentUser) {
                throw new Error('User not authenticated after registration');
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

              // Update auth signal before Firestore write
              this.authService.currentUserSignal.set(userData);

              // Create the user document
              await this.firestoreService.createDocument(`users/${response.user.uid}`, userData);

              // C'est un nouvel utilisateur, donc on le redirige directement vers le quiz
              this.router.navigate(['/skills']);

            } catch (error) {
              // Reset auth state and logout on failure
              this.authService.currentUserSignal.set(null);
              this.authService.logOut().subscribe();
            }
          },
          error: (error) => {
            alert(error.message || 'Registration failed. Please try again.');
          }
        });
    }
  }
}
