// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "firebase_ Apikey",
  authDomain: "video-bf547.firebaseapp.com",
  projectId: "video-bf547",
  storageBucket: "video-bf547.appspot.com",
  messagingSenderId: "573385338509",
  appId: "1:573385338509:web:df75767cbf95962a857cc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const  auth = getAuth()
export const provider =new GoogleAuthProvider();

export default app;