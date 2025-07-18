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

@Injectable({
  providedIn: 'root'
})
export class FirestoreService<T extends DocumentData> {

  constructor(private firestore: Firestore) { };

  // requests single documents
  public async CreateDocument(docPath: string, data: any) {
    const docReference = doc(this.firestore, docPath);
    await setDoc(docReference, data);
  };

  // nous permet d'ajouter un document à une collection
  public async addDocument(collectionPath: string, data: any) {
    const collectionRef = collection(this.firestore, collectionPath);
    const doc = await addDoc(collectionRef, data);
    return doc.id;
  }

  //demande un document spécifique et retourne ses données
  public async getDocument(docPath: string): Promise<T | null> {
    const docReference = doc(this.firestore, docPath);
    const docSnap = await getDocFromServer(docReference);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null
  };

  // met à jour un document spécifique
  public async updateDocument(collectionPath: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath);
    await updateDoc(docRef, data);
  };

  public async deleteDocument(docPath: string): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }

  // récupère une collection entière et retourne un tableau d'objets
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

  public async markCommentAsRead(commentId: string): Promise<void> {
    const commentRef = doc(this.firestore, `messages/${commentId}`);
    await updateDoc(commentRef, {
      read: true,
      updatedAt: new Date()
    });
  }

  public async editComment(commentId: string, newText: string): Promise<void> {
    const commentRef = doc(this.firestore, `messages/${commentId}`);
    await updateDoc(commentRef, {
      text: newText,
      isEdited: true,
      editedAt: new Date()
    });
  }

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


