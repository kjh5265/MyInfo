// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB02vQBnLSyPwQHWPCJ99rndI4gW6mCJOE",
  authDomain: "myinfo-a7e4f.firebaseapp.com",
  projectId: "myinfo-a7e4f",
  storageBucket: "myinfo-a7e4f.firebasestorage.app",
  messagingSenderId: "43420379536",
  appId: "1:43420379536:web:64b2716b368c4210c56b15",
  measurementId: "G-Q7T7WTWY0Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
