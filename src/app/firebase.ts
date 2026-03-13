// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxVnXIu5v-TXu7qcIanZHm2fEFZT3w_CA",
  authDomain: "volcanorom-cf6e9.firebaseapp.com",
  projectId: "volcanorom-cf6e9",
  storageBucket: "volcanorom-cf6e9.firebasestorage.app",
  messagingSenderId: "752837085921",
  appId: "1:752837085921:web:26a12309ea6a4d04b205a0",
  measurementId: "G-ND9G0Q5JX5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
