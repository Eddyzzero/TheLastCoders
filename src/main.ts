import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  
// configutation de Firebase
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByaNQzJ1Gsy1W5LaCvuL8UdrctPTOxCls",
  authDomain: "thelastcoders-a40c9.firebaseapp.com",
  projectId: "thelastcoders-a40c9",
  storageBucket: "thelastcoders-a40c9.firebasestorage.app",
  messagingSenderId: "537287186785",
  appId: "1:537287186785:web:b4333145d3151c70b98d20",
  measurementId: "G-31X9TT8LCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);