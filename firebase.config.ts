// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0yfd1qWmNhDT-PdMnKPF4Su_GBDR4-_0",
  authDomain: "p2--cc.firebaseapp.com",
  projectId: "p2--cc",
  storageBucket: "p2--cc.firebasestorage.app",
  messagingSenderId: "952249619556",
  appId: "1:952249619556:web:55dfafb29b94a984e2bb71"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export { firebaseConfig };
