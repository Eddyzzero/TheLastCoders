import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialiser Firebase Admin
admin.initializeApp();

// Exemple de fonction pour créer un utilisateur
export const createUser = functions.https.onCall(async (data, context) => {
    // Vérifier l'authentification
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { email, displayName, photoURL } = data;
    const uid = context.auth.uid;

    try {
        // Créer le document utilisateur dans Firestore
        await admin.firestore().collection('users').doc(uid).set({
            email,
            displayName,
            photoURL,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, uid };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new functions.https.HttpsError('internal', 'Error creating user');
    }
});

// Exemple de fonction pour obtenir les statistiques
export const getStats = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const [linksSnapshot, usersSnapshot] = await Promise.all([
            admin.firestore().collection('links').get(),
            admin.firestore().collection('users').get()
        ]);

        return {
            totalLinks: linksSnapshot.size,
            totalUsers: usersSnapshot.size,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        throw new functions.https.HttpsError('internal', 'Error getting statistics');
    }
});

// Fonction pour nettoyer les données orphelines
export const cleanupOrphanedData = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    console.log('Running cleanup of orphaned data...');

    try {
        // Ici vous pouvez ajouter la logique de nettoyage
        // Par exemple, supprimer les liens sans propriétaire valide
        console.log('Cleanup completed successfully');
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
});
