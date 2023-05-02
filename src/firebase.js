// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7R6vOPg30ahfGUYQ3nupBd42d16RYBlM",
  authDomain: "react-ts-golang-ecsite.firebaseapp.com",
  projectId: "react-ts-golang-ecsite",
  storageBucket: "react-ts-golang-ecsite.appspot.com",
  messagingSenderId: "958011775140",
  appId: "1:958011775140:web:c228b7083784636d576e31"
};
// Initialize Cloud Firestore and get a reference to the service

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export const firebaseApp = {db, storage, auth};
