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

  currentUser = user(this.auth);
  isLoggedIn = authState(this.auth).pipe(map(user => !!user));

  constructor(private auth: Auth) { }

  // inscription avec mail
  register(email: string, password: string,): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  // connexion avec mail
  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // deconnexion
  logOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  // reset password
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  // verifier si l'utilisateur est connecté
  ckecAuthState(): Observable<boolean> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          return of(true);
        } else {
          return of(false);
        }
      }),
      catchError(() => of(false)),
    )
  }

  // Obtenir l'ID de l'utilisateur actuel
  getCurrentUserId(): Observable<string | null> {
    return this.currentUser.pipe(
      map(user => user ? user.uid : null)
    );
  }
}
