import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { Firestore, collectionData, collection, doc, getDoc, updateDoc, DocumentReference, deleteDoc, query, where, setDoc, Timestamp } from '@angular/fire/firestore';
import { Observable, from, of, map, catchError, switchMap, firstValueFrom } from 'rxjs';
import { UserInterface, UserImageUrl } from '../../features/auth/interfaces/user.interface';
import { AuthService } from './fireAuth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersFirestore = inject(Firestore);
  private authService = inject(AuthService);
  private usersCollection = collection(this.usersFirestore, 'users');
  private _userLogged: UserInterface | undefined = undefined;
  private userProfileImage = signal<string>('assets/images/icons/UserIcon.png');
  private userProfileImageBase64 = signal<string>('');

  constructor() {
    // Utiliser effect pour réagir aux changements du signal
    effect(() => {
      const currentUser = this.authService.currentUserSignal();
      if (currentUser) {
        this._userLogged = currentUser;
        // Charger les données complètes de l'utilisateur
        this.getUserById(currentUser.id || '').subscribe(user => {
          if (user?.userImageUrl?.base64) {
            this.userProfileImage.set(user.userImageUrl.base64);
          } else if (user?.userImageUrl?.url) {
            this.userProfileImage.set(user.userImageUrl.url);
          } else {
            this.userProfileImage.set('assets/images/icons/UserIcon.png');
          }
        });
      } else {
        this._userLogged = undefined;
        this.userProfileImage.set('assets/images/icons/UserIcon.png');
      }
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

    return from(getDoc(userDocRef)).pipe(
      map(doc => {
        if (!doc.exists()) {
          // Create a minimal user document if it doesn't exist
          const basicUserData: UserInterface = {
            id: userId,
            email: '',
            userName: 'Nouvel utilisateur',
            createdAt: new Date(),
            role: 'reader'
          };
          // Save the basic user data
          from(setDoc(userDocRef, basicUserData)).subscribe();
          return basicUserData;
        }

        const userData = doc.data();
        return {
          id: doc.id,
          userName: userData['userName'] || 'Nouvel utilisateur',
          email: userData['email'] || '',
          createdAt: userData['createdAt']?.toDate() || new Date(),
          role: userData['role'] as 'reader' | 'author' | 'admin' || 'reader',
          ...userData
        } as UserInterface;
      }),
      catchError(error => {
        console.error('Error in getUserById:', error);
        // Return a minimal user object instead of throwing
        const tempUser: UserInterface = {
          id: userId,
          email: '',
          userName: 'Utilisateur temporaire',
          createdAt: new Date(),
          role: 'reader'
        };
        return of(tempUser);
      })
    );
  }

  updateUserProfile(userId: string, userData: Partial<UserInterface>): Observable<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Mettre à jour le signal de l'image de profil si une nouvelle image est fournie
    if (userData.userImageUrl?.base64) {
      this.userProfileImage.set(userData.userImageUrl.base64);
    } else if (userData.userImageUrl?.url) {
      this.userProfileImage.set(userData.userImageUrl.url);
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

  // Suppression du document utilisateur pour l'utilisateur courant (sans exigence admin)
  deleteOwnUserDocument(userId: string): Promise<void> {
    if (!userId) {
      return Promise.reject(new Error('User ID is required'));
    }
    const userDocRef = doc(this.usersFirestore, `users/${userId}`);
    return deleteDoc(userDocRef);
  }

  // Supprimer la réponse de quiz de l'utilisateur si elle existe
  deleteOwnQuizResponse(userId: string): Promise<void> {
    if (!userId) {
      return Promise.reject(new Error('User ID is required'));
    }
    const quizDocRef = doc(this.usersFirestore, `quiz_responses/${userId}`);
    return deleteDoc(quizDocRef).catch(() => Promise.resolve());
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

  public getUserProfileImage(): Signal<string> {
    return this.userProfileImage;
  }

  // Méthode pour obtenir l'image de profil de l'utilisateur connecté
  public getCurrentUserImage(): string {
    return this.userProfileImage();
  }

  public updateProfileImageSignal(imageUrl: string) {
    this.userProfileImage.set(imageUrl);
  }

  async updateUserProfileWithBase64Image(userId: string, userData: Partial<UserInterface>, base64Image: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Vérifier si l'utilisateur actuel a le droit de modifier ce profil
    const canModify = await firstValueFrom(this.canModifyUser(userId));
    if (!canModify) {
      throw new Error('Vous n\'avez pas les droits nécessaires pour modifier ce profil');
    }

    // Simplifier la structure pour Firestore
    const updatedData = {
      ...userData,
      userImageUrl: {
        base64: base64Image,
        url: '',
        createdAt: Timestamp.now()
      }
    };

    // Mettre à jour le profil dans Firestore
    const userDocRef = doc(this.usersFirestore, `users/${userId}`);
    await updateDoc(userDocRef, updatedData);

    // Mettre à jour le signal
    this.userProfileImage.set(base64Image);

    console.log('Profil utilisateur mis à jour avec succès');
  }
}
