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

// const firebaseConfig = {
//   apiKey: "AIzaSyChcmT6j0Odya7uLp5kMOx8WztiYHRKSRg",
//   authDomain: "aperture-f2abe.firebaseapp.com",
//   projectId: "aperture-f2abe",
//   storageBucket: "aperture-f2abe.appspot.com",
//   messagingSenderId: "404260521084",
//   appId: "1:404260521084:web:c96771716245b4275ab5f9",
//   measurementId: "G-174606WG0W"
// };

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
