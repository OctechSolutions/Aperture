import React, { useEffect, useState } from 'react'
import { FirebaseApp } from "../config"
import { useDispatch, useSelector } from 'react-redux'
import { Login, Logout, SelectUser } from '../config';
import { Auth } from '../config';
import { Db } from "../config";

export const AuthContext = React.createContext()

/* AuthProvider is a custom provider compoment used for authentication.
   { children } argument are all components this component encompasses. */
export function AuthProvider({ children }) {
    // Stores current user.
    const [currentUser, setCurrentUser] = useState(null) 

    // Stores whether the authentication process has been completed or not.
    const [authenticating, setAuthenticating] = useState(true) 

    const user = useSelector(SelectUser); // Select the currently logged in user from the slice using redux
    const dispatch = useDispatch(); // Keep track of changes on the user slice

    /* Upon authentication, a user instance is returned. This
       user is set as the current user. Once authentication
       is complete, the authenticating state is set to false. */
    useEffect(() => {
        FirebaseApp.auth().onAuthStateChanged(userAuth => {
            setCurrentUser(userAuth)
            setAuthenticating(false)

            if (userAuth) { // If user logs in, userAuth becomes true as it holds some value
                Db.collection("users").where("email", "==", userAuth.email).get().then(function (querySnapshot) { //This is a firebase query to get all users in the db with the name of the current user
                  if (querySnapshot.size === 0) { // If there is none in the db, it means its the first time the user is logging in and he is added to the db
                    // This if condition will only be true when the user logs in for the first time
                    Db.collection("users").doc(userAuth.email).set({
                      name: userAuth.displayName,
                      email: userAuth.email,
                      photoUrl: userAuth.photoURL,
                      posts: []
                    });
                    console.log(userAuth.email, "Added to the DB")
                  }
                  else {
                    // If already in db do nothing
                    console.log("Already in DB")
                  }
                })
                // The dispatch function sets the user in the redux slice so that we know which user is logged in, all this info is stored in the login state
                dispatch(Login({
                  email: userAuth.email,
                  uid: userAuth.uid,
                  displayName: userAuth.displayName,
                  photoUrl: userAuth.photoURL,
                }))
              } else {
                // This else part evaluates true when the userAuth is null i.e. the user has logged out
                dispatch(Logout()); // Simply calls the logout state in the slice
              }
        })
    }, [dispatch]) // dispatch is the variable which is always listened to by the use effect which means it only executes when there is a change in dispatch.

    /* If the authentication process is still occuring, then 
       a message indicating this will be displayed. Once authentication
       is complete, the Provider with above AuthContext will be returned.

       This is to avoid the context being retuned with an empty currentUser
       because the user authentication process was still going on when it 
       was being returned. */
    return (
        authenticating ?
        <p> Authenticating ... </p> :
        <AuthContext.Provider value={{currentUser}}>
            { children }
        </AuthContext.Provider>
    )
}
