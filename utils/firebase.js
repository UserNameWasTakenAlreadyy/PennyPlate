import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQXTZyknU1f75dKcAW5SSuNVoK0jdove8",
  authDomain: "pennyplate2.firebaseapp.com",
  projectId: "pennyplate2",
  storageBucket: "pennyplate2.appspot.com",
  messagingSenderId: "991358836796",
  appId: "1:991358836796:web:bc593727da2b19ca71a339",
  measurementId: "G-HM04JBS1X2"
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
