// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import admin from 'firebase-admin';
import { applicationDefault, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import 'dotenv/config';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBQ3OHHTBDkJ1ZHyd_6wz8N-C566fR_Vgc',
  authDomain: 'react2024q3-graphiql-client.firebaseapp.com',
  projectId: 'react2024q3-graphiql-client',
  storageBucket: 'react2024q3-graphiql-client.appspot.com',
  messagingSenderId: '1005893842320',
  appId: '1:1005893842320:web:ba129c5348c70abe992f15',
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

if (!admin.apps.length) {
  initializeAdminApp({
    credential: applicationDefault(),
  });
}

const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export async function firebaseSignIn(email: string, password: string) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function firebaseSignUp(email: string, password: string) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function getSessionToken(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (Date.now() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error('Recent sign in required');
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

export async function signOutFirebase() {
  await signOut(getAuth());
}
