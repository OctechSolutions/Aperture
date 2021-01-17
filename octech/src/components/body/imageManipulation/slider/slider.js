import React from 'react'
import './slider.css'

export default function Slider(props) {
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