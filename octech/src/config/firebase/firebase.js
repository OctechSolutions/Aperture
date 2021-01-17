import firebase from 'firebase'

// Aperture Project Firebase configuration.
const firebaseConfig = {
    apiKey: "AIzaSyChcmT6j0Odya7uLp5kMOx8WztiYHRKSRg",
    authDomain: "aperture-f2abe.firebaseapp.com",
    projectId: "aperture-f2abe",
    storageBucket: "aperture-f2abe.appspot.com",
    messagingSenderId: "404260521084",
    appId: "1:404260521084:web:c96771716245b4275ab5f9",
    measurementId: "G-174606WG0W"
};

// Initializing Firebase App.
const firebaseApp = firebase.initializeApp(firebaseConfig)

// Google authentication provider.
const googleProvider = new firebase.auth.GoogleAuthProvider()

const auth = firebase.auth();

const db = firebaseApp.firestore() //database

const storage = firebaseApp.storage()

const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider).then((res) => { // Function to enable the popup sign in with google box
    console.log(res.user) // Res is the result console.logged for debugging purposes
  }).catch((error) => {
    console.log(error.message) // On error with sign in this is logged, again for testing purposes.
  })
}

export { firebaseApp, signInWithGoogle, db, storage, auth }