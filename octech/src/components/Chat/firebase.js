// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
//Authenticating and connecting the firebase db with frontend React
var firebaseConfig = {
  apiKey: "AIzaSyC1EfNasAc6J8vIFP3Lephiv4sKQwFmvFQ",
  authDomain: "zeta-range-302607.firebaseapp.com",
  projectId: "zeta-range-302607",
  storageBucket: "zeta-range-302607.appspot.com",
  messagingSenderId: "977379520665",
  appId: "1:977379520665:web:dc658797bf971db6458808",
  measurementId: "G-CQ4NPNG155"
};

  //Passing the firebase config and initializing the app
  const firebaseApp = firebase.initializeApp(firebaseConfig)
  //Grabs all the data and pulls it into db
  const db = firebaseApp.firestore();
  //Preparing Authentication module
  const auth = firebase.auth();
  //Preparing the Google provider
  const googleprovider = new firebase.auth.GoogleAuthProvider()

  export { auth, googleprovider}
  export default db;