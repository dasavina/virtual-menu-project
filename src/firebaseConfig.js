// src/firebaseConfig.js
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeZ5Zt0KVaee67rWMFqMoOLbTV7Rvk1Zo",
  authDomain: "restaurant-ea8e8.firebaseapp.com",
  databaseURL: "https://restaurant-ea8e8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "restaurant-ea8e8",
  storageBucket: "restaurant-ea8e8.firebasestorage.app",
  messagingSenderId: "615424724015",
  appId: "1:615424724015:web:ba16efcbb59bf8ed1f4ada",
  measurementId: "G-ZZSK6XW14H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { db };
