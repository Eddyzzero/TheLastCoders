import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { ref, uploadBytes } from 'firebase/storage';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {
  private auth = inject(Auth);

  constructor(private storage: Storage) { }

  // Upload une image et retourne son URL
  uploadImage(file: File, path: string): Observable<string> {
    if (!this.auth.currentUser) {
      return throwError(() => new Error("L'utilisateur doit être authentifié"));
    }

    // Vérifier si le fichier est valide
    const storageRef = ref(this.storage, path);
    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(snapshot => from(getDownloadURL(snapshot.ref))),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Supprimer une image
  deleteImage(path: string): Observable<void> {
    if (!this.auth.currentUser) {
      return throwError(() => new Error("L'utilisateur doit être authentifié"));
    }
    // Vérifier si le chemin est valide
    const storageRef = ref(this.storage, path);
    return from(deleteObject(storageRef)).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Générer un nom de fichier unique
  generateUniqueFileName(file: File): string {
    const extension = file.name.split('.').pop();
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}.${extension}`;
  }
}
