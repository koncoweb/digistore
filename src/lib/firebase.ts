import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDwgKugc9_vpDZUWwoskpodsXig-e0693U",
  authDomain: "spitikonote.firebaseapp.com",
  databaseURL: "https://spitikonote-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spitikonote",
  storageBucket: "spitikonote.appspot.com",
  messagingSenderId: "20984540603",
  appId: "1:20984540603:web:33ba53e54f9d0061a0a89e",
  measurementId: "G-8YGTJXNLB5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
