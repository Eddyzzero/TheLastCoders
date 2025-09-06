import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

/**
 * Configuration principale de l'application Angular
 * 
 * Cette configuration inclut :
 * - Le routage de l'application
 * - L'initialisation de Firebase (Auth, Firestore, Storage)
 * - Les providers globaux
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Configuration du routage
    provideRouter(routes),

    // Configuration Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
};
