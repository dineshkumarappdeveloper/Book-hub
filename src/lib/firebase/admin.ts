import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_ADMIN_SDK_CONFIG environment variable is not set.');
    }
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
    // Depending on the application's needs, you might want to throw the error,
    // or handle it gracefully if Firebase is optional for some parts.
    // For now, we log the error. If critical, consider: throw error;
  }
}

export const firestore = admin.firestore();
export default admin;
