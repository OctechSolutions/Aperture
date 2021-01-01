import React from 'react'
import logo_white_bg from '../images/logo/aperture_lens_white_bg.jpg'
import './Login.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class Login extends React.Component {
    render(){
        return (
            <div className="container-fluid login">
                <div className="row">
                    <div className="col-md-5">
                        <div className="text">
                            <p id="aperture-heading">Aperture</p>
                            <p id="tagline">Dare to Venture</p>
                        </div>
                        <img src={logo_white_bg} id="logo_white_bg" />
                    </div>
                    <div className="col-md-7">
                        <div className="black-veil">
                            <div className="corner-frame">
                                <div className="tapered-frame">
                                    <h1>Welcome! :)</h1>
                                    <div className="form-group">
                                        <label>Username or Email</label>
                                        <input type="text" className="form-control" id="input-username-email" placeholder="Enter Username / Email ID" />
                                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" className="form-control" id="input-password" placeholder="Enter Password" />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input class="btn btn-primary log-in-btn" type="submit" value="Log In" />
                                        </div>
                                        <div className="col-md-6">
                                            <input class="btn btn-primary sign-up-btn" type="submit" value="Sign Up" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )   
    }
}

export default Login
