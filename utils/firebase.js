import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCqXGZrlJJKrKF25hS20icHgewjXCcIzNo",
  authDomain: "pennyplate-14a94.firebaseapp.com",
  databaseURL: "https://pennyplate-14a94-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pennyplate-14a94",
  storageBucket: "pennyplate-14a94.appspot.com",
  messagingSenderId: "902389742938",
  appId: "1:902389742938:web:57f120fabee5c4b7bf0763"
};

let app;
let auth;


if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
  
}

const db = getFirestore(app);
export { auth, db };
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
