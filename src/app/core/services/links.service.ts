import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Link } from '../models/link.model';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private linksCollection: AngularFirestoreCollection<Link>;

  constructor(private firestore: AngularFirestore) {
    this.linksCollection = this.firestore.collection<Link>('links');
  }

  // Créer un nouveau lien
  async createLink(link: Omit<Link, 'id'>): Promise<string> {
    const linkRef = await this.linksCollection.add(link);
    return linkRef.id;
  }

  // Obtenir tous les liens
  getLinks(): Observable<Link[]> {
    return this.linksCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Obtenir un lien spécifique
  getLink(id: string): Observable<Link | undefined> {
    return this.firestore.doc<Link>(`links/${id}`).valueChanges();
  }

  // Mettre à jour un lien
  updateLink(id: string, link: Partial<Link>): Promise<void> {
    return this.linksCollection.doc(id).update(link);
  }

  // Supprimer un lien
  deleteLink(id: string): Promise<void> {
    return this.linksCollection.doc(id).delete();
  }

  // Obtenir les liens d'un utilisateur spécifique
  getLinksByUser(userId: string): Observable<Link[]> {
    return this.firestore
      .collection<Link>('links', ref => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
}
