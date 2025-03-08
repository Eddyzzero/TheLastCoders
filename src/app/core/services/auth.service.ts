import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { UserInterface } from '../../features/auth/interfaces/user.interface';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private fireStoreService = inject(FirestoreService);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  firebaseAuth = inject(Auth);
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);
  isLoggedIn$: any;

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  getCurrentUser() {
    return this.userSubject.value
  }


  // register the user
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

  // login foncion
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(() => { });
    return from(promise);
  }

  // logout fonction
  logOut(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}
