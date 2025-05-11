import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Ensure this module only initializes once.
if (!admin.apps.length) {
  const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
  if (!serviceAccountString) {
    console.error('CRITICAL: FIREBASE_ADMIN_SDK_CONFIG environment variable is not set. Firebase Admin SDK cannot initialize. Please check your .env file or server environment variables.');
    // Throwing here will prevent the app from starting if Firebase is critical, which is often desired.
    throw new Error('FIREBASE_ADMIN_SDK_CONFIG environment variable is not set.');
  }

  let serviceAccount: ServiceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountString);
  } catch (e) {
    console.error('CRITICAL: Failed to parse FIREBASE_ADMIN_SDK_CONFIG. Ensure it is a valid JSON string.', e);
    throw new Error(`Invalid FIREBASE_ADMIN_SDK_CONFIG format: ${(e as Error).message}`);
  }
  
  // Basic validation of service account content
  if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    console.error('CRITICAL: FIREBASE_ADMIN_SDK_CONFIG is missing required fields (project_id, private_key, client_email).');
    throw new Error('FIREBASE_ADMIN_SDK_CONFIG is missing required fields (project_id, private_key, client_email).');
  }

  const databaseURL = process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`;
  
  // Validate databaseURL format (simple check)
  if (!(databaseURL.startsWith('https://') && databaseURL.endsWith('.firebaseio.com'))) {
      console.warn(`Attempting to use databaseURL: ${databaseURL}. If this is incorrect or causes issues, please ensure FIREBASE_DATABASE_URL is correctly set in your environment variables. A common format is https://<PROJECT_ID>-default-rtdb.firebaseio.com.`);
  }


  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseURL,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (e) {
    console.error('CRITICAL: Firebase Admin SDK admin.initializeApp failed:', e);
    // Include more details from the error if possible
    let message = `Firebase Admin SDK admin.initializeApp failed.`;
    if(e instanceof Error) {
        message += ` Message: ${e.message}`;
        if((e as any).code) {
            message += ` Code: ${(e as any).code}`;
        }
    }
    console.error(`Full error details: ${JSON.stringify(e)}`);
    throw new Error(message); // Re-throw to make it obvious
  }
} else {
    // This block is executed if admin.apps.length > 0, meaning an app (presumably the default) is already initialized.
    console.log('Firebase Admin SDK already initialized. Using existing app.');
}

// These will now only be accessed if initializeApp above was successful.
// If initializeApp threw an error, the module loading would have stopped before these lines,
// or these lines would fail if accessed after a failed initialization elsewhere.
export const firestore = admin.firestore();
export const database = admin.database();
export default admin;
