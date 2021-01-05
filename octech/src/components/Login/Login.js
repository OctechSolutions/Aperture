import React from 'react';
import './Login.css';
import { signInWithGoogle } from '../../firebase'

function Login() {
  return (
    <button className="google-btn" onClick = {signInWithGoogle}>Sign in with google</button>
  );
}

export default Login
