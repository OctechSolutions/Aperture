// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
//Authenticating and connecting the firebase db with frontend React
const firebaseConfig = {
    apiKey: "AIzaSyChcmT6j0Odya7uLp5kMOx8WztiYHRKSRg",
    authDomain: "aperture-f2abe.firebaseapp.com",
    projectId: "aperture-f2abe",
    storageBucket: "aperture-f2abe.appspot.com",
    messagingSenderId: "404260521084",
    appId: "1:404260521084:web:c96771716245b4275ab5f9",
    measurementId: "G-174606WG0W"
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