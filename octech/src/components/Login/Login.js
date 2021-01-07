import React from 'react';
import './Login.css';
import { signInWithGoogle } from '../../firebase'

function Login() {
  return (
    <button className="google-btn" onClick = {signInWithGoogle}>Sign in with google</button> // Clicking this button calls the function that initiates the popup for signing in
  );
}

export default Login
