import { effect, inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
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

  public gerUserConnectedFullName(): string | undefined {
    return this._userLogged?.userName;
  }
}
