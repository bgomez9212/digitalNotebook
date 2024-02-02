// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfGySeuAbrYDoVIbgKLHhMK_H7oSXV-LQ",
  authDomain: "thenotebook-53588.firebaseapp.com",
  projectId: "thenotebook-53588",
  storageBucket: "thenotebook-53588.appspot.com",
  messagingSenderId: "760490551001",
  appId: "1:760490551001:web:1f586349ba6f53b67b40c8",
  measurementId: "G-825SMLTZG3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
