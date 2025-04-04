import { Injectable } from '@angular/core';
import { Storage } from '@angular/fire/storage'
import { ref, uploadBytes } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(private storage: Storage) { }

  //Uplad file
  async uploadFile(file: File, path: string) {
    const storageRef = ref(this.storage, path);
    return await uploadBytes(storageRef, file);
  }
}
