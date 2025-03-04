import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  user,
} from '@angular/fire/auth'
import { signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from '../../user.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);


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

  logOut(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}
