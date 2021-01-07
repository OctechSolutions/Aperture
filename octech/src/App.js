import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Feed from './components/Body/Feed/Feed';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import { login, logout, selectUser } from './features/userSlice';
import { auth } from './firebase';
import { db } from "./firebase";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        db.collection("users").where("name", "==", userAuth.displayName).get().then(function (querySnapshot) {
          if (querySnapshot.size === 0) {
            db.collection("users").doc(userAuth.displayName).set({
              name: userAuth.displayName,
              posts: []
            });
            console.log(userAuth.displayName, "Added to the DB")
          }
          else {
            console.log("Already in DB")
          }
        })
        dispatch(login({
          email: userAuth.email,
          uid: userAuth.uid,
          displayName: userAuth.displayName,
          photoUrl: userAuth.photoURL,
        }))
      } else {
        dispatch(logout());
      }
    })
  }, [dispatch]);

  return (
    <div className="app">
      <Header />

      {!user ? (
        <Login />
      ) : (
          <div className="app_body">
            <Feed />
          </div>
        )}

    </div>
  );
}

export default App;
