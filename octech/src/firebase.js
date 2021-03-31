// import firebase from 'firebase'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import * as config from "./firebase-config"


var firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore(); //database
const storage = firebaseApp.storage()
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider()
const signInWithGoogle = () => {
  auth.signInWithRedirect(googleProvider).then((res) => { // Function to enable the popup sign in with google box
    // console.log(res.user) // Res is the result console.logged for debugging purpose
    console.log(()=> db.collection("users").doc(res.user.displayName).get().then(doc => {console.log(doc.data())}))
  }).catch((error) => {
    console.log(error.message) // On error with sign in this is logged, again for testing purposes.
  })
}


export { db, auth, signInWithGoogle, storage, firebaseApp }; 
