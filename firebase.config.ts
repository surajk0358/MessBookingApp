
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvNoPUyMcnfi3fHPLIKSxTwNbZ-WF-jjw",
  authDomain: "m1-cc-e20c9.firebaseapp.com",
  projectId: "m1-cc-e20c9",
  storageBucket: "m1-cc-e20c9.firebasestorage.app",
  messagingSenderId: "10893609366",
  appId: "1:10893609366:web:0b3ed3ac3ace751fe8f5b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;