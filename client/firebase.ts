// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
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
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
