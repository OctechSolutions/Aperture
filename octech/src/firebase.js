import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyC1EfNasAc6J8vIFP3Lephiv4sKQwFmvFQ",
  authDomain: "zeta-range-302607.firebaseapp.com",
  projectId: "zeta-range-302607",
  storageBucket: "zeta-range-302607.appspot.com",
  messagingSenderId: "977379520665",
  appId: "1:977379520665:web:dc658797bf971db6458808",
  measurementId: "G-CQ4NPNG155"
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
