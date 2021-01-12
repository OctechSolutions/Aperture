/* Inspired from YouTube video 
   "Firebase React Authentication Tutorial For Beginners - Private Route With Hooks"
   uploaded on May 5, 2019 by "Maksim Ivanov" */

import React, { useCallback } from 'react'
import FirebaseApp from '../../config/firebase'
import firebase from 'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const SignUp = ({history}) => {
    const handleSubmit = useCallback(async event => {
        event.preventDefault()
        const { email, 
                passwordConfirm
        } = event.target.elements
        try {
            await FirebaseApp
            .auth()
            .createUserWithEmailAndPassword(email.value, passwordConfirm.value)
            history.push("/")
        } catch (error) {
            alert(error)
        }
    }, [history])

    const handleGoogleSignIn = useCallback(event => {
        console.log('Google Sign In')
    }, [history])

    return (
        <form className="sign-up" onSubmit={handleSubmit}>
            <h1 style={{textAlign: "center"}}>Sign Up</h1>

            {/* Name Input */}
            <input 
                name="name"
                required={true}
                type="text" 
                className="mb-3 form-control" 
                placeholder="Name *"  
            />

            {/* Username Input */}
            <input  
                name="username"
                required={true}
                type="text" 
                className="mb-3 form-control" 
                placeholder="Username *"
            />

            {/* Email Input */}
            <input 
                name="email"
                required={true}
                type="email" 
                className="mb-3 form-control" 
                placeholder="Email *"
            />

            {/* Password Input */}
            <input 
                name="password"
                required={true}
                type="password" 
                className="mb-3 form-control" 
                placeholder="Password *" 
            />

            {/* Password Confirmation Input */}
            <input 
                name="passwordConfirm"
                required={true}
                type="password" 
                className="mb-3 form-control" 
                placeholder="Confirm Password" 
            />

            {/* Contact Number Input */}
            <input 
                name="contactNumber"
                type="tel" 
                className="mb-3 form-control" 
                placeholder="Contact Number" 
            />

            {/* Submit Button Input */}
            <input 
                name="submitBtn"
                className="btn btn-primary mb-3" 
                type="submit" 
                value="Submit" 
                style={{width: "100%"}}
            />

            {/* Google Sign Up Button Input */}
            <button 
                name="googleSignUpBtn"
                className="btn btn-outline-primary mb-3" 
                style={{width: "100%"}}
                onClick={handleGoogleSignIn}
            > Sign In With Google </button>
        </form>
    )
}

export default SignUp
