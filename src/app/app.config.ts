import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebase = {
  apiKey: "AIzaSyByaNQzJ1Gsy1W5LaCvuL8UdrctPTOxCls",
  authDomain: "thelastcoders-a40c9.firebaseapp.com",
  projectId: "thelastcoders-a40c9",
  storageBucket: "thelastcoders-a40c9.firebasestorage.app",
  messagingSenderId: "537287186785",
  appId: "1:537287186785:web:b4333145d3151c70b98d20",
  measurementId: "G-31X9TT8LCJ"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirestore(() => getFirestore()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebase)),
    provideAuth(() => getAuth()),
  ]
};
