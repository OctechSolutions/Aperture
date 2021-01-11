/* Code inspired from YouTube video, "React Firebase User Login & Signup" 
   uploaded on April 5, 2018 by "Dave Bennett - Development".
   Link = https://www.youtube.com/watch?v=r4EsP6rovwk */

import React from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.css'

export default class SignUp extends React.Component {
    constructor(props) {
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit() {
        console.log("Submitted")
    }

    render() {
        return (
            <div className="sign-up">
                <h1 style={{textAlign: "center"}}>Sign Up</h1>

                <input 
                    required={true}
                    type="text" 
                    className="mb-3 form-control" 
                    placeholder="Name *"  
                />

                <input  
                    required={true}
                    type="text" 
                    className="mb-3 form-control" 
                    placeholder="Username *"
                />

                <input 
                    required={true}
                    type="email" 
                    className="mb-3 form-control" 
                    placeholder="Email *"
                />

                <input 
                    required={true}
                    type="password" 
                    className="mb-3 form-control" 
                    placeholder="Password *" 
                />

                <input 
                    required={true}
                    type="password" 
                    className="mb-3 form-control" 
                    placeholder="Confirm Password" 
                />

                <input 
                    type="tel" 
                    className="mb-3 form-control" 
                    placeholder="Contact Number" 
                />

                <input 
                    className="btn btn-primary mb-3" 
                    type="submit" 
                    value="Submit" 
                    style={{width: "100%"}}
                    onClick={this.handleSubmit()}
                />

                <input 
                    className="btn btn-outline-primary mb-3" 
                    type="submit" 
                    value="Sign Up using Google" 
                    style={{width: "100%"}}
                    onClick={this.handleSubmit()}
                />
            </div>
        )
    }
}
