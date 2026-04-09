// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPO7WKyoh-4I4PBK_dbP9B-tH9swJX_4g",
  authDomain: "mf-packages-ccd62.firebaseapp.com",
  projectId: "mf-packages-ccd62",
  storageBucket: "mf-packages-ccd62.firebasestorage.app",
  messagingSenderId: "870863881106",
  appId: "1:870863881106:web:7a39e4693fdd15130eb74b",
  measurementId: "G-QLE6GWZN0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth, app };
