/* Inspired from YouTube video 
   "Firebase React Authentication Tutorial For Beginners - Private Route With Hooks"
   uploaded on May 5, 2019 by "Maksim Ivanov" */

import React, { useCallback } from 'react'
import { FirebaseApp } from '../../config'
import { ProfilePic, GoogleSignInBtn } from '../../components'
import { SignInWithGoogle } from '../../config'
import firebase from'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.css'

const SignUp = ({ history }) => {
    // handleSubmit = What to do when the sign up form is submitted?
    const handleSubmit = useCallback(async event => {
        event.preventDefault() // Prevent default behavior of re-loading etc.

        // Object destructuring to extract form inputs.
        const { profilePic,
                name,
                username,
                email, 
                password,
                passwordConfirm,
                contactNumber
        } = event.target.elements

        /* If both the 1st typed password and the confirmed password are
           same, then proceed to sign up. Else promt user to input matching
           passwords. */
        if (passwordConfirm.value === password.value) {
            try {
                await FirebaseApp // Wait until the user has been added to authenticated users list in Firebase.
                .auth()
                .createUserWithEmailAndPassword(email.value, passwordConfirm.value)
                history.push("/") // Push the home page to history to redirect to it.
            } catch (error) {
                alert(error)
            }
        } else {
            alert("The password and the confirmed password must match.")
        }
    }, [history])

    const handleGoogleSignIn = useCallback(async event => {
        // console.log("Google Sign In")
        try {
            await SignInWithGoogle // Wait until the google authentication process is complete.
            history.push("/") // Push the home page to history to redirect to it.
        } catch (error) {
            alert(error)
        }
    }, [history])

    // Returns a Sign Up form.
    return (
        <form className="sign-up" onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <ProfilePic 
                name="profilePic"
                imgSrc="https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814049_1280.png" 
                value="https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814049_1280.png"
            />

            {/* Sign Up Heading */}
            <p style={{ 
                textAlign: "center", 
                marginBottom: "2%",
                fontSize: "2rem"
            }}>Sign Up</p>

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
            <GoogleSignInBtn 
                style={{width: "100%"}}
                handleSignInWithGoogle={handleGoogleSignIn}
            />

        </form>
    )
}

export default SignUp
