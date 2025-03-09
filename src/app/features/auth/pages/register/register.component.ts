import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/fireAuth.service';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { FirebaseError } from 'firebase/app';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  styleUrl: './register.component.css'
})


export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService<any>,
    private fb: FormBuilder,
    private router: Router

  ) {
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
      const { email, password, userName } = this.registerForm.value;

      // call auth service to create the user
      this.authService.register(email, password, userName)
        .subscribe({
          next: () => {
            console.log('Inscription réussie');
            this.router.navigate(['/skills']);
          },
          error: (error: FirebaseError) => {
            console.error('Erreur lors de l\'inscription:', error);
          }
        });
    }
  }
}
