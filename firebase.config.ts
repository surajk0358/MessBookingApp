// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdmtzDUKA9kh0JsWsePDoAgnjRMn5TfJI",
  authDomain: "messauthapp.firebaseapp.com",
  projectId: "messauthapp",
  storageBucket: "messauthapp.firebasestorage.app",
  messagingSenderId: "363142023981",
  appId: "1:363142023981:web:fe57aedee9b57952c961a4",
  measurementId: "G-EKDYYYS03F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export default app;