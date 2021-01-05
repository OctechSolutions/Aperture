import React from 'react'
import './index.css'

export default function AddOverlays(props) {
    return (
        <button className="add_overlays_btn">
            <p>{props.value.title}</p>
        </button>
    )
}
