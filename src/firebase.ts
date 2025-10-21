// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8PzpA4uEmLn28gzMpOAWXYzG4zmyf1ko",
  authDomain: "ascend-app-ded59.firebaseapp.com",
  projectId: "ascend-app-ded59",
  storageBucket: "ascend-app-ded59.firebasestorage.app",
  messagingSenderId: "688810284383",
  appId: "1:688810284383:web:a79b6db337b86480dcd2ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);