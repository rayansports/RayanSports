import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getFirestore as getFirestoreLite } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = typeof window !== 'undefined' ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : null as any;
const liteDb = typeof window !== 'undefined' ? getFirestoreLite(app, firebaseConfig.firestoreDatabaseId) : getFirestoreLite(app, firebaseConfig.firestoreDatabaseId);
const auth = typeof window !== 'undefined' ? getAuth(app) : null as any;
const storage = typeof window !== 'undefined' ? getStorage(app) : null as any;

if (typeof window !== 'undefined') {
  async function testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }
  testConnection();
}

export { app, db, liteDb, auth, storage };
