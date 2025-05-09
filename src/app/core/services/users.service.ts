import { effect, inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, getDoc, updateDoc, DocumentReference, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, from, of, map, catchError, switchMap } from 'rxjs';
import { UserInterface } from '../../features/auth/interfaces/user.interface';
import { AuthService } from './fireAuth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersFirestore = inject(Firestore);
  private authService = inject(AuthService);
  private usersCollection = collection(this.usersFirestore, 'users');
  private _userLogged: UserInterface | undefined = undefined;

  constructor() {
    // Utiliser effect pour réagir aux changements du signal
    effect(() => {
      this._userLogged = this.authService.currentUserSignal() || undefined;
    });
  }

  getUsers(): Observable<UserInterface[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<UserInterface[]>;
  }

  getUserById(userId: string): Observable<UserInterface> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const userDocRef = doc(this.usersFirestore, `users/${userId}`);
    return from(getDoc(userDocRef).then(doc => {
      if (doc.exists()) {
        const userData = doc.data();
        return {
          id: doc.id,
          userName: userData['userName'] || '',
          email: userData['email'] || '',
          createdAt: userData['createdAt']?.toDate() || new Date(),
          ...userData
        } as UserInterface;
      }
      throw new Error('User not found');
    }));
  }

  updateUserProfile(userId: string, userData: Partial<UserInterface>): Observable<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Vérifier si l'utilisateur actuel a le droit de modifier ce profil
    return this.canModifyUser(userId).pipe(
      map(canModify => {
        if (!canModify) {
          throw new Error('Vous n\'avez pas les droits nécessaires pour modifier ce profil');
        }

        console.log('Mise à jour du profil utilisateur:', userData);
        const userDocRef = doc(this.usersFirestore, `users/${userId}`) as DocumentReference<UserInterface>;
        return updateDoc(userDocRef, userData);
      }),
      switchMap(updatePromise => from(updatePromise))
    );
  }

  // Méthode pour changer le rôle d'un utilisateur (admin uniquement)
  changeUserRole(userId: string, newRole: 'reader' | 'author' | 'admin'): Observable<void> {
    return this.isCurrentUserAdmin().pipe(
      switchMap(isAdmin => {
        if (!isAdmin) {
          throw new Error('Seuls les administrateurs peuvent changer les rôles');
        }
        const userDocRef = doc(this.usersFirestore, `users/${userId}`);
        return from(updateDoc(userDocRef, { role: newRole }));
      })
    );
  }

  // Méthode pour supprimer un utilisateur (admin uniquement)
  deleteUser(userId: string): Observable<void> {
    return this.isCurrentUserAdmin().pipe(
      switchMap(isAdmin => {
        if (!isAdmin) {
          throw new Error('Seuls les administrateurs peuvent supprimer des utilisateurs');
        }
        const userDocRef = doc(this.usersFirestore, `users/${userId}`);
        return from(deleteDoc(userDocRef));
      })
    );
  }

  // Vérifier si l'utilisateur actuel est administrateur
  isCurrentUserAdmin(): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of(false);
    }

    return this.getUserById(currentUser.uid).pipe(
      map(user => user.role === 'admin'),
      catchError(() => of(false))
    );
  }

  // Vérifier si l'utilisateur actuel peut modifier un autre utilisateur
  canModifyUser(targetUserId: string): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of(false);
    }

    // Si c'est son propre profil, l'utilisateur peut le modifier
    if (currentUser.uid === targetUserId) {
      return of(true);
    }

    // Sinon, vérifier s'il est admin
    return this.isCurrentUserAdmin();
  }

  public gerUserConnectedFullName(): string | undefined {
    return this._userLogged?.userName;
  }
}
