import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_ADMIN_SDK_CONFIG environment variable is not set.');
    }
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);

    // Ensure the databaseURL is provided if not automatically inferred or if connecting to a specific region
    const databaseURL = process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}.firebaseio.com`;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseURL,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    // Depending on the application's needs, you might want to throw the error,
    // or handle it gracefully if Firebase is optional for some parts.
    // For now, we log the error. If critical, consider: throw error;
  }
}

export const firestore = admin.firestore(); // Keep for potential other uses or gradual migration
export const database = admin.database();
export default admin;
