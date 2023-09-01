import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'
import { getAuth, GoogleAuthProvider } from '@firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAbGXAp9IymC-aJ5o2exdzSPm0k1YvACbM",
    authDomain: "crud-blog-firebase.firebaseapp.com",
    projectId: "crud-blog-firebase",
    storageBucket: "crud-blog-firebase.appspot.com",
    messagingSenderId: "756489793105",
    appId: "1:756489793105:web:c0697daccd9431f7351270",
    measurementId: "G-V6MJ4ZBD6J"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const storage = getStorage(app)

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();