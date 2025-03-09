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
  firebaseAuth = inject(Auth);
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);

  constructor(private auth: Auth) {
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
  register(email: string, userName: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((response) => {
        return updateProfile(response.user, { displayName: userName });
      })
      .catch((error) => {
        throw error; // Gestion d'erreur si nécessaire
      });

    return from(promise).pipe(
      catchError((error: FirebaseError) => {
        console.error('Erreur lors de l\'inscription:', error.message);
        throw error; // Propager l'erreur pour la gestion dans le composant
      })
    );
  }

  // Connexion de l'utilisateur
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(() => { })
      .catch((error) => {
        throw error; // Gestion d'erreur si nécessaire
      });
    console.log("bien recupéré")


    return from(promise).pipe(
      catchError((error: FirebaseError) => {
        console.error('Erreur lors de la connexion:', error.message);
        throw error; // Propager l'erreur pour la gestion dans le composant
      })
    );
  }

  // Déconnexion de l'utilisateur
  logOut(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise).pipe(
      catchError((error: FirebaseError) => {
        console.error('Erreur lors de la déconnexion:', error.message);
        throw error; // Propager l'erreur pour la gestion dans le composant
      })
    );
  }

  // Envoi de l'email de réinitialisation du mot de passe
  sendPasswordResetEmail(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email);
    return from(promise).pipe(
      catchError((error: FirebaseError) => {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error.message);
        throw error; // Propager l'erreur pour la gestion dans le composant
      })
    );
  }
}
