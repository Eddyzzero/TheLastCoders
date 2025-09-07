import { Injectable } from '@angular/core';
import { Firestore, CollectionReference, Query } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocFromServer,
  setDoc,
  updateDoc,
  query,
  getDocs,
  onSnapshot,
  where,
  orderBy
} from 'firebase/firestore';
import { Observable } from 'rxjs';

/**
 * Service générique pour les opérations Firestore
 * 
 * Ce service fournit des méthodes CRUD génériques pour :
 * - Créer, lire, mettre à jour et supprimer des documents
 * - Gérer les collections avec des requêtes personnalisées
 * - Écouter les changements en temps réel
 * - Gérer les commentaires et messages
 */
@Injectable({
  providedIn: 'root'
})
export class FirestoreService<T extends DocumentData> {
  constructor(private firestore: Firestore) { }

  /**
   * Crée un document à un chemin spécifique
   * @param docPath - Chemin du document (ex: 'users/userId')
   * @param data - Données à stocker
   */
  public async createDocument(docPath: string, data: any): Promise<void> {
    const docReference = doc(this.firestore, docPath);
    await setDoc(docReference, data);
  }

  /**
   * Ajoute un document à une collection et retourne son ID
   * @param collectionPath - Chemin de la collection
   * @param data - Données à ajouter
   * @returns ID du document créé
   */
  public async addDocument(collectionPath: string, data: any): Promise<string> {
    const collectionRef = collection(this.firestore, collectionPath);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  /**
   * Récupère un document spécifique
   * @param docPath - Chemin du document
   * @returns Données du document ou null si inexistant
   */
  public async getDocument(docPath: string): Promise<T | null> {
    try {
      const docReference = doc(this.firestore, docPath);
      const docSnap = await getDocFromServer(docReference);

      if (docSnap.exists()) {
        return docSnap.data() as T;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * Met à jour un document existant
   * @param docPath - Chemin du document
   * @param data - Données à mettre à jour
   */
  public async updateDocument(docPath: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await updateDoc(docRef, data);
  }

  /**
   * Supprime un document
   * @param docPath - Chemin du document
   */
  public async deleteDocument(docPath: string): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }

  /**
   * Récupère une collection avec possibilité de requête personnalisée
   * @param collectionPath - Chemin de la collection
   * @param queryFn - Fonction de requête optionnelle
   * @returns Observable des documents de la collection
   */
  public getCollection(
    collectionPath: string,
    queryFn?: (ref: CollectionReference) => Query
  ): Observable<T[]> {
    const collectionRef = collection(this.firestore, collectionPath);
    const queryRef = queryFn ? queryFn(collectionRef) : query(collectionRef);

    return new Observable<T[]>(observer => {
      const unsubscribe = onSnapshot(queryRef,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          } as unknown)) as T[];
          observer.next(items);
        },
        (error) => {
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  // === MÉTHODES SPÉCIALISÉES POUR LES COMMENTAIRES ===

  /**
   * Récupère tous les commentaires d'un lien spécifique
   * @param linkId - ID du lien
   * @returns Liste des commentaires triés par date (plus récent en premier)
   */
  public async getCommentsByLinkId(linkId: string): Promise<T[]> {
    const q = query(
      collection(this.firestore, 'messages'),
      where('linkId', '==', linkId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as unknown)) as T[];
  }

  /**
   * Marque un commentaire comme lu
   * @param commentId - ID du commentaire
   */
  public async markCommentAsRead(commentId: string): Promise<void> {
    const commentRef = doc(this.firestore, `messages/${commentId}`);
    await updateDoc(commentRef, {
      read: true,
      updatedAt: new Date()
    });
  }

  /**
   * Modifie le texte d'un commentaire
   * @param commentId - ID du commentaire
   * @param newText - Nouveau texte
   */
  public async editComment(commentId: string, newText: string): Promise<void> {
    const commentRef = doc(this.firestore, `messages/${commentId}`);
    await updateDoc(commentRef, {
      text: newText,
      isEdited: true,
      editedAt: new Date()
    });
  }

  /**
   * Répond à un commentaire existant
   * @param parentId - ID du commentaire parent
   * @param commentData - Données du nouveau commentaire
   * @returns ID du nouveau commentaire
   */
  public async replyToComment(parentId: string, commentData: Partial<T>): Promise<string> {
    const commentsRef = collection(this.firestore, 'messages');
    const docRef = await addDoc(commentsRef, {
      ...commentData,
      parentId,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      read: false
    });
    return docRef.id;
  }
}


