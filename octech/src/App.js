import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Feed from './components/Body/Feed/Feed';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Profile from './components/userProfile/Profile';
import { login, logout, selectUser } from './features/userSlice';
import { auth } from './firebase';
import { db } from "./firebase";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Collection from './Collections/Collection.js';


function App() {
  const user = useSelector(selectUser); // Select the currently logged in user from the slice using redux
  const dispatch = useDispatch(); // Keep track of changes on the user slice

  useEffect(() => { // useEffect keeps listening to the variables passed in the array at the end
    auth.onAuthStateChanged(userAuth => { // When the state of the user changes this function is called that is if the user logs in or out this function gets called
      

      if (userAuth) { // If user logs in, userAuth becomes true as it holds some value
        
        console.log(userAuth);
        db.collection("users").where("email", "==", userAuth.email).get().then(function (querySnapshot) { //This is a firebase query to get all users in the db with the name of the current user
          if (querySnapshot.size === 0) { // If there is none in the db, it means its the first time the user is logging in and he is added to the db
            // This if condition will only be true when the user logs in for the first time
            if (userAuth.displayName) {
              db.collection("users").doc(userAuth.displayName).set({
                name: userAuth.displayName,
                email: userAuth.email,
                photoUrl: userAuth.photoURL,
                posts: []
              });
              console.log(userAuth.displayName, "Added to the DB")
            }

          }
          else {
            // If already in db do nothing
            console.log("Already in DB")
          }
        })
        // The dispatch function sets the user in the redux slice so that we know which user is logged in, all this info is stored in the login state
        dispatch(login({
          email: userAuth.email,
          uid: userAuth.uid,
          displayName: userAuth.displayName,
          photoUrl: userAuth.photoURL,
        }))
      } else {
        // This else part evaluates true when the userAuth is null i.e. the user has logged out
        dispatch(logout()); // Simply calls the logout state in the slice
      }
    })
  }, [dispatch]); // dispatch is the variable which is always listened to by the use effect which means it only executes when there is a change in dispatch

  return (
    <Router> {/* BrowserRouter (renamed to router) is used to route the user to different pages in our app everything wrapped under it can use the router functions */}
      {!user ? ( // This is basically an if condition (ternary operator) which checks if the user exists (this user variable is fetched using useSelector which is a redux function to get the user if he is logged in)
        <Login /> // The login component is called whenever the user attribute in the slice is false i.e. when the user is logged out
      ) : (
          // When the user is logged in the following code is executed
          <div className="app">
            <Header /> {/* The header is always rendered if the user is logged in */}

            <Route path="/feed" exact component={Feed} />
            <Route path="/user/:id" exact component={Profile} /> {/* Dynamically generated user pages, the user lands on /user/{username} when clicking on someone profile, the profile page of the user is rendered by the profile component */}
            <Route path="/user/:id/:collection" exact component={Collection} />
            <Route path="/user/:id/channel/:channel" exact component={Feed} />
          </div>)}
    </Router>
  );
}

export default App;
