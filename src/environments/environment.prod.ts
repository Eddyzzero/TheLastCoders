/**
 * Configuration de l'environnement de production
 * 
 * Cette configuration contient :
 * - Les paramètres Firebase pour la production
 * - Les flags de production (true pour la prod)
 * - Les identifiants de mesure Google Analytics
 */
export const environment = {
    production: true,
    firebase: {
        apiKey: "AIzaSyByaNQzJ1Gsy1W5LaCvuL8UdrctPTOxCls",
        authDomain: "thelastcoders-a40c9.firebaseapp.com",
        projectId: "thelastcoders-a40c9",
        storageBucket: "thelastcoders-a40c9.firebasestorage.app",
        messagingSenderId: "537287186785",
        appId: "1:537287186785:web:b4333145d3151c70b98d20",
        measurementId: "G-31X9TT8LCJ"
    }
};