import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  DocumentData
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore)

  //add documents from collection (firestore)
  addDocument(collectionName: string, data: DocumentData): Observable<string> {
    const collectionRef = collection(this.firestore, collectionName);
    return from(addDoc(collectionRef, data).then(ref => ref.id));
  }

  // Get documents from collection (firestore)
  getDocuments(collectionName: string): Observable<DocumentData[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return from(getDocs(collectionRef).then(snapshot =>
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })),
    ));
  }

  // Get documents with query
  getDocumentsWhere(
    collectionName: string,
    field: string,
    operator: any,
    value: any
  ): Observable<DocumentData[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, where(field, operator, value));

    return from(getDocs(q).then(snapshot =>
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    ));
  }
}


