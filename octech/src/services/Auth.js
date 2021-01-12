import React, { useEffect, useState } from 'react'
import { FirebaseApp } from "../config"

export const AuthContext = React.createContext()

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        FirebaseApp.auth().onAuthStateChanged(setCurrentUser)
    }, [])

    return (
        <AuthContext.Provider value={{currentUser}}>
            { children }
        </AuthContext.Provider>
    )
}
