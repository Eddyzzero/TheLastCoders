import { Injectable } from '@angular/core';
import {
  Firestore,
} from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocFromServer,
  setDoc,
  updateDoc
} from 'firebase/firestore';

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

  public async addDocument(collectionPath: string, data: any) {
    const collectionRef = collection(this.firestore, collectionPath);
    const doc = await addDoc(collectionRef, data);
    return doc.id;
  }

  public async getDocument(docPath: string): Promise<T | null> {
    const docReference = doc(this.firestore, docPath);
    const docSnap = await getDocFromServer(docReference);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null
  };

  public async updateDocument(collectionPath: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath);
    await updateDoc(docRef, data);
  };

  public async deleteDocument(docPath: string): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }
}


