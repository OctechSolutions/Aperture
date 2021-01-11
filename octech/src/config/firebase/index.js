import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEd4a_IJw8g5X3NQcKz1itgnYKD9ZfBRo",
    authDomain: "aperture-test-ff551.firebaseapp.com",
    projectId: "aperture-test-ff551",
    storageBucket: "aperture-test-ff551.appspot.com",
    messagingSenderId: "143682216621",
    appId: "1:143682216621:web:5ee6b81ab5c9997c5f5c24"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp