'use server';

import { database } from '@/lib/firebase/admin';
import type { AdminUser } from '@/lib/types';
import admin from 'firebase-admin';

const ADMIN_USERS_REF = 'adminUsers';

// IMPORTANT SECURITY NOTE: 
// Storing passwords directly, even in RTDB accessed by Admin SDK, is highly insecure.
// In a real application, passwords MUST be hashed using a strong algorithm like bcrypt.
// This implementation uses plaintext for demonstration due to project constraints.

export async function createAdminUser(username: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    const existingUserSnapshot = await database.ref(ADMIN_USERS_REF)
      .orderByChild('username')
      .equalTo(username)
      .once('value');

    if (existingUserSnapshot.exists()) {
      return { success: false, message: 'Username already exists.' };
    }

    // In a real app: const passwordHash = await bcrypt.hash(password, 10);
    const passwordHash = password; // SECURITY RISK: Storing plaintext password

    const newUserRef = database.ref(ADMIN_USERS_REF).push();
    const newAdminUserData = {
      username,
      passwordHash, // Store the hash
      role: 'admin',
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };
    await newUserRef.set(newAdminUserData);

    return { success: true, message: 'Admin user created successfully.' };
  } catch (error) {
    console.error('Error creating admin user in RTDB:', error);
    return { success: false, message: 'Failed to create admin user.' };
  }
}

export async function verifyAdminUser(username: string, password: string): Promise<{ success: boolean; user?: AdminUser; message?: string }> {
  try {
    const snapshot = await database.ref(ADMIN_USERS_REF)
      .orderByChild('username')
      .equalTo(username)
      .limitToFirst(1) // Ensure only one user is processed if multiple (should not happen with unique usernames)
      .once('value');

    if (!snapshot.exists()) {
      return { success: false, message: 'Invalid username or password.' };
    }

    let userId = '';
    let userData: any = null; // Omit<AdminUser, 'id'> without passwordHash ideally
    
    snapshot.forEach(childSnapshot => { // Gets the first (and should be only) child
        userId = childSnapshot.key!;
        userData = childSnapshot.val();
        return true; // break loop
    });

    if (!userData) {
         return { success: false, message: 'User data not found.' };
    }
    
    // In a real app: const isMatch = await bcrypt.compare(password, userData.passwordHash);
    const isMatch = userData.passwordHash === password; // SECURITY RISK: Plaintext comparison

    if (isMatch) {
      // Don't send passwordHash to client
      const { passwordHash, ...userToReturn } = userData;
      return { success: true, user: { id: userId, ...userToReturn } as AdminUser };
    } else {
      return { success: false, message: 'Invalid username or password.' };
    }
  } catch (error) {
    console.error('Error verifying admin user from RTDB:', error);
    return { success: false, message: 'Authentication error.' };
  }
}
