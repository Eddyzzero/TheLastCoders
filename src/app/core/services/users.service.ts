import { effect, inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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

  public gerUserConnectedFullName(): string | undefined {
    return this._userLogged?.userName;
  }
}
