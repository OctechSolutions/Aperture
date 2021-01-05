import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyChcmT6j0Odya7uLp5kMOx8WztiYHRKSRg",
  authDomain: "aperture-f2abe.firebaseapp.com",
  projectId: "aperture-f2abe",
  storageBucket: "aperture-f2abe.appspot.com",
  messagingSenderId: "404260521084",
  appId: "1:404260521084:web:c96771716245b4275ab5f9",
  measurementId: "G-174606WG0W"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider()
const signInWithGoogle = () => {
  auth.signInWithPopup(googleProvider).then((res) => {
    console.log(res.user)
  }).catch((error) => {
    console.log(error.message)
  })
}


export { db, auth, signInWithGoogle };
