// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBooAocrud1fGH0xEN6pm1W6s4NfaByK3w",
  authDomain: "swipenshop-dd3b6.firebaseapp.com",
  projectId: "swipenshop-dd3b6",
  storageBucket: "swipenshop-dd3b6.firebasestorage.app",
  messagingSenderId: "233864348208",
  appId: "1:233864348208:web:468aa2e1efbd98936723f5",
  measurementId: "G-S1Q3DZ57RP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);