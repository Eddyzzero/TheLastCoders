import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth'
import { response } from 'express';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  firebaseAuth = inject(Auth);

  register(email: string, userName: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(response => {
      updateProfile(response.user, { displayName: userName });
    });

    return from(promise);
  }
  //TODO: creer le login pour l'utilisateur.
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(() => { });
    return from(promise);
  }
}
