import React from 'react'
import './index.css'

export default function Slider(props) {
    // Slider controls the value of the filter's effect.
    return (
        <div className="slider-container">
            <input 
                type="range" 
                className="slider"
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={props.handleChange}
            ></input>
        </div>
    )
}
