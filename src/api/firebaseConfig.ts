
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyByyBLWf0es6FLcyk43kGbGEs76s9daIIk",
    authDomain: "wellbe-admin.firebaseapp.com",
    projectId: "wellbe-admin",
    storageBucket: "wellbe-admin.firebasestorage.app",
    messagingSenderId: "767950692779",
    appId: "1:767950692779:web:d587ac9061ae02241df2ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
