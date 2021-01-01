import firebase from '../../node_modules/firebase/app'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBs_B_ZEOy8-IMhcWF12D09XkhfkuD7J44",
    authDomain: "fir-react-upload-e1198.firebaseapp.com",
    projectId: "fir-react-upload-e1198",
    storageBucket: "fir-react-upload-e1198.appspot.com",
    messagingSenderId: "756860039721",
    appId: "1:756860039721:web:1bd13d38084fe51cafe238",
    measurementId: "G-JYBNRJRZXR"
}

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage
export default { storage, firebase }