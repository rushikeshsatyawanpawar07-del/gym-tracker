import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBPPjTh_lQS3nOjEpjH9vT4AVQF_3UUHb4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "gym-tracker-8d929.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "gym-tracker-8d929",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "gym-tracker-8d929.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "198596812856",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:198596812856:web:a54b0f54318bf800ed86cd",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
