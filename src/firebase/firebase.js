// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlI-gA-cDr9ekguP9Nbjwy_AhrWwBr_I4",
  authDomain: "pingreviewai.firebaseapp.com",
  projectId: "pingreviewai",
  storageBucket: "pingreviewai.firebasestorage.app",
  messagingSenderId: "477167161040",
  appId: "1:477167161040:web:949f5b0e94f87f744998d5",
  measurementId: "G-R054N2PVJQ"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
