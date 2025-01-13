import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-6ad45.firebaseapp.com",
  projectId: "reactchat-6ad45",
  storageBucket: "reactchat-6ad45.firebasestorage.app",
  messagingSenderId: "339750501290",
  appId: "1:339750501290:web:fcbe11885526c6d74489d3",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const db = getFirestore();

export const storage = getStorage();

