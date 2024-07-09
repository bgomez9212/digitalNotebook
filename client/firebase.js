// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpp3HRxp3TRq26U84aW0ZKmvZEiVwp7V0",
  authDomain: "thenotebook-e6229.firebaseapp.com",
  projectId: "thenotebook-e6229",
  storageBucket: "thenotebook-e6229.appspot.com",
  messagingSenderId: "55908572804",
  appId: "1:55908572804:web:cff1989ee5be3e2011acd1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
