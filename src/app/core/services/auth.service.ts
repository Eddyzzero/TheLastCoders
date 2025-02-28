import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  UserCredential,
  user,
  authState
} from '@angular/fire/auth'
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private auth: Auth;
  currentUser: Observable<any>;
  isLoggedIn: Observable<boolean>;

  constructor(auth: Auth) {
    this.auth = auth;
    this.currentUser = authState(this.auth);
    this.isLoggedIn = this.currentUser.pipe(
      map(user => !!user)
    );
  }

  // Inscription avec email et mot de passe
  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  // Connexion avec email et mot de passe
  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Déconnexion
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Réinitialisation du mot de passe
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  // Vérifier si l'utilisateur est connecté
  checkAuthState(): Observable<boolean> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          return of(true);
        } else {
          return of(false);
        }
      }),
      catchError(() => of(false))
    );
  }

  // Obtenir l'ID de l'utilisateur actuel
  getCurrentUserId(): Observable<string | null> {
    return this.currentUser.pipe(
      map(user => user ? user.uid : null)
    );
  }
}
