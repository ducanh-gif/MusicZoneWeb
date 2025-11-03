import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js"
import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtm1jlSdchSL8yv8JMcHtQDsZ-QOO9m1U",
  authDomain: "musiczone-21122008.firebaseapp.com",
  projectId: "musiczone-21122008",
  storageBucket: "musiczone-21122008.firebasestorage.app",
  messagingSenderId: "659224097965",
  appId: "1:659224097965:web:0efb534e1c09ae7a838224",
  measurementId: "G-1WYDT7ZBW7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
console.log("Firebase initialized:", app);