import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserInterface } from '../../features/auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersFirestore = inject(Firestore);
  private usersCollection = collection(this.usersFirestore, 'users');

  getUsers(): Observable<UserInterface[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<UserInterface[]>;
  }

  constructor() { }
}
