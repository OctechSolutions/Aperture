import React, { useEffect, useState } from 'react'
import { FirebaseApp } from "../config"

export const AuthContext = React.createContext()

/* AuthProvider is a custom provider compoment used for authentication.
   { children } argument are all components this component encompasses. */
export function AuthProvider({ children }) {
    // Stores current user.
    const [currentUser, setCurrentUser] = useState(null) 

    // Stores whether the authentication process has been completed or not.
    const [authenticating, setAuthenticating] = useState(true) 

    /* Upon authentication, a user instance is returned. This
       user is set as the current user. Once authentication
       is complete, the authenticating state is set to false. */
    useEffect(() => {
        FirebaseApp.auth().onAuthStateChanged(userAuth => {
            setCurrentUser(userAuth)
            setAuthenticating(false)
        })
    }, [])

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
