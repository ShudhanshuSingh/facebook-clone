import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBLc0M5RMUSPf8OPczzZ7r7sOeDBtXEndU",
    authDomain: "facebook-clone-a13cf.firebaseapp.com",
    databaseURL: "https://facebook-clone-a13cf.firebaseio.com",
    projectId: "facebook-clone-a13cf",
    storageBucket: "facebook-clone-a13cf.appspot.com",
    messagingSenderId: "193464716750",
    appId: "1:193464716750:web:f646ef13b80438051bef9f",
    measurementId: "G-3ZSS3SH1TV"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db , auth, storage};