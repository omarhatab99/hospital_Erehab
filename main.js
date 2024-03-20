// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGbTMei7wK4hWaGE1avDVySXx7Xx3BsRE",
  authDomain: "hospital-el-rehab-final.firebaseapp.com",
  projectId: "hospital-el-rehab-final",
  storageBucket: "hospital-el-rehab-final.appspot.com",
  messagingSenderId: "631009567076",
  appId: "1:631009567076:web:c35798c77380eaa0565a71"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const firestore = initializeFirestore(app , {
  experimentalForceLongPolling: true,
});
