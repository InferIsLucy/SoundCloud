// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkJveiAWA96nQM7UEcRrYekc6TJeXS2IQ",
  authDomain: "soundcloudclone-30184.firebaseapp.com",
  projectId: "soundcloudclone-30184",
  storageBucket: "soundcloudclone-30184.appspot.com",
  messagingSenderId: "374763912130",
  appId: "1:374763912130:web:630663c04fc6f669acf45b",
  measurementId: "G-11BSDNLM9N",
};

// Initialize Firebase
let app;
if (firebase.app.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth };
