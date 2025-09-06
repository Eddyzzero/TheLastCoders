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
import { BehaviorSubject, Observable, from, catchError, map } from 'rxjs';
import { UserInterface } from '../../features/auth/interfaces/user.interface';
import { FirestoreService } from './firestore.service';
import { FirebaseError } from 'firebase/app';

/**
 * Service d'authentification Firebase
 * 
 * Ce service gère :
 * - L'inscription et la connexion des utilisateurs
 * - La déconnexion et la réinitialisation de mot de passe
 * - L'état d'authentification en temps réel
 * - La synchronisation avec Firestore pour les données utilisateur
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Services injectés
  private fireStoreService = inject(FirestoreService);
  private auth = inject(Auth);

  // Observables pour l'état d'authentification
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  public isLoggedIn$ = this.user$.pipe(map(user => !!user));

  // Signal pour l'utilisateur actuel (format personnalisé)
  public currentUserSignal = signal<UserInterface | null | undefined>(undefined);

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initialise l'état d'authentification au démarrage
   * Configure les observateurs Firebase Auth
   */
  private initializeAuthState(): void {
    // Initialisation de l'utilisateur actuel
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.userSubject.next(currentUser);
      this.updateCurrentUserSignal(currentUser);
    }

    // Écoute les changements d'état d'authentification
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      if (user) {
        this.updateCurrentUserSignal(user);
      } else {
        this.currentUserSignal.set(null);
      }
    });
  }

  /**
   * Met à jour le signal de l'utilisateur actuel
   * @param user - Utilisateur Firebase
   */
  private updateCurrentUserSignal(user: User): void {
    this.currentUserSignal.set({
      id: user.uid,
      email: user.email!,
      userName: user.displayName || '',
      createdAt: new Date(),
    });
  }

  /**
   * Retourne l'utilisateur actuellement authentifié
   * @returns User Firebase ou null
   */
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Inscription d'un nouvel utilisateur
   * @param email - Email de l'utilisateur
   * @param userName - Nom d'utilisateur
   * @param password - Mot de passe
   * @returns Observable<UserCredential>
   */
  register(email: string, userName: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (response) => {
        await updateProfile(response.user, { displayName: userName });
        return response;
      }))
      .pipe(
        catchError((error: FirebaseError) => {
          throw error;
        })
      );
  }

  /**
   * Connexion d'un utilisateur existant
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Observable<UserCredential>
   */
  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(
        catchError((error: FirebaseError) => {
          throw error;
        })
      );
  }

  /**
   * Déconnexion de l'utilisateur actuel
   * @returns Observable<void>
   */
  logOut(): Observable<void> {
    return from(signOut(this.auth))
      .pipe(
        catchError((error: FirebaseError) => {
          throw error;
        })
      );
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   * @param email - Email de l'utilisateur
   * @returns Observable<void>
   */
  sendPasswordResetEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email))
      .pipe(
        catchError((error: FirebaseError) => {
          throw error;
        })
      );
  }
}
