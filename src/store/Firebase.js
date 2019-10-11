import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDtx-NfIxOqgTTow30vgc5-HmUKKBNzCjs",
  authDomain: "andrewhan.firebaseapp.com",
  databaseURL: "https://andrewhan.firebaseio.com",
  projectId: "andrewhan",
  storageBucket: "andrewhan.appspot.com",
  messagingSenderId: "339056046222",
  appId: "1:339056046222:web:631b4a33524bf4ed5a99df",
  measurementId: "G-BES5N7ECXL"
});

const db = firebaseApp.firestore();

export { db };

export function onUserChange(callback) {
  return firebase.auth().onAuthStateChanged(callback);
}

export function getCurrentUser() {
  return firebase.auth().currentUser;
}

export async function signInWithPopup() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  return result;
}

export async function signOut() {
  return await firebase.auth().signOut();
}
