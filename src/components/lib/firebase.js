import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_Key,
  authDomain: "chatter-582df.firebaseapp.com",
  databaseURL: "https://chatter-582df-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatter-582df",
  storageBucket: "chatter-582df.appspot.com",
  messagingSenderId: "954991963438",
  appId: "1:954991963438:web:79f1fadb342002a2395ebf",
  measurementId: "G-9SC1S3ZN1D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()