import admin from 'firebase-admin';
import { env } from './env.js';
if (!admin.apps.length) admin.initializeApp({ projectId: env.FIREBASE_PROJECT_ID });
export const db = admin.firestore();
