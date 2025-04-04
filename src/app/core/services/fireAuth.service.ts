import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, catchError } from 'rxjs';
import { UserInterface } from '../../features/auth/interfaces/user.interface';
import { FirestoreService } from './firestore.service';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fireStoreService = inject(FirestoreService);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private auth = inject(Auth);
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);

  constructor() {
    // Écoute les changements d'état de l'utilisateur
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      if (user) {
        this.currentUserSignal.set({
          id: user.uid,
          email: user.email!,
          userName: user.displayName!,
          createdAt: new Date(),
        });
      } else {
        this.currentUserSignal.set(null);
      }
    });
  }

  // Retourne l'utilisateur actuellement authentifié
  getCurrentUser() {
    return this.userSubject.value;
  }

  // Inscription de l'utilisateur
  register(email: string, userName: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (response) => {
        await updateProfile(response.user, { displayName: userName });
        return response;
      }))
      .pipe(
        catchError((error: FirebaseError) => {
          console.error('Erreur lors de l\'inscription:', error.message);
          throw error;
        })
      );
  }

  // Connexion de l'utilisateur
  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(
        catchError((error: FirebaseError) => {
          console.error('Erreur lors de la connexion:', error.message);
          throw error;
        })
      );
  }

  // Déconnexion de l'utilisateur
  logOut(): Observable<void> {
    return from(signOut(this.auth))
      .pipe(
        catchError((error: FirebaseError) => {
          console.error('Erreur lors de la déconnexion:', error.message);
          throw error;
        })
      );
  }

  // Envoi de l'email de réinitialisation du mot de passe
  sendPasswordResetEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email))
      .pipe(
        catchError((error: FirebaseError) => {
          console.error('Erreur lors de la réinitialisation du mot de passe:', error.message);
          throw error;
        })
      );
  }
}
