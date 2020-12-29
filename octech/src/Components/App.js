import React from "react"
import logo_yellow from "../images/aperture_lens_beige.png"

class App extends React.Component{
  render(){
    return (
      <div className="placeholder">
        <img id="logo_image" src={logo_yellow} alt="aperture lens logo" />
        <div className="break"></div>
        <h1 id="logo_writing">Aperture</h1>
      </div>
    )
  }
}

export default App;
