import React from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.css'

export default function SignUp() {

    function handleSubmit() {
        console.log("Submitted")
    }

    return (
        <div className="sign-up">
            <h1 style={{textAlign: "center"}}>Sign Up</h1>

            {/* Name Input */}
            <input 
                required={true}
                type="text" 
                className="mb-3 form-control" 
                placeholder="Name *"  
            />

            {/* Username Input */}
            <input  
                required={true}
                type="text" 
                className="mb-3 form-control" 
                placeholder="Username *"
            />

            {/* Email Input */}
            <input 
                required={true}
                type="email" 
                className="mb-3 form-control" 
                placeholder="Email *"
            />

            {/* Password Input */}
            <input 
                required={true}
                type="password" 
                className="mb-3 form-control" 
                placeholder="Password *" 
            />

            {/* Password Confirmation Input */}
            <input 
                required={true}
                type="password" 
                className="mb-3 form-control" 
                placeholder="Confirm Password" 
            />

            {/* Contact Number Input */}
            <input 
                type="tel" 
                className="mb-3 form-control" 
                placeholder="Contact Number" 
            />

            {/* Submit Button Input */}
            <input 
                className="btn btn-primary mb-3" 
                type="submit" 
                value="Submit" 
                style={{width: "100%"}}
                onClick={handleSubmit}
            />

            {/* Google Sign Up Button Input */}
            <input 
                className="btn btn-outline-primary mb-3" 
                type="submit" 
                value="Sign Up using Google" 
                style={{width: "100%"}}
                onClick={handleSubmit}
            />
        </div>
    )
}
