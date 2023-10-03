import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAzLUgz__Ms0opjyur0l-1K_b_6Jt9d9Yc",
  authDomain: "cinemaelk-899c4.firebaseapp.com",
  projectId: "cinemaelk-899c4",
  storageBucket: "cinemaelk-899c4.appspot.com",
  messagingSenderId: "896524324612",
  appId: "1:896524324612:web:75a88d7bbfa94d6dbf0a51"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)