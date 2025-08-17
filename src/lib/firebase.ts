
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "trusttrack-x9zmu",
  appId: "1:114707506439:web:f01e7f10a0bcef988351a2",
  storageBucket: "trusttrack-x9zmu.firebasestorage.app",
  apiKey: "AIzaSyB0mEotQExNNZFaF7Nc9Xp4n80MSCCjYG8",
  authDomain: "trusttrack-x9zmu.firebaseapp.com",
  messagingSenderId: "114707506439",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
