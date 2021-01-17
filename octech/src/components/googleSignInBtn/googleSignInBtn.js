import React from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

function GoogleSignInBtn({style, handleSignInWithGoogle}) {
  return (
    <button 
      className="btn btn-outline-primary mb-3" 
      style={style}
      onClick = {handleSignInWithGoogle}
    >Sign In with Google</button> // Clicking this button calls the function that initiates the popup for signing in.
  );
}

export default GoogleSignInBtn