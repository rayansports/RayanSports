import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore only on the client side to prevent Next.js SSR from throwing gRPC errors
let db: Firestore;
if (typeof window !== 'undefined') {
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export { db };
