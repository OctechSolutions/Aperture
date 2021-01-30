import React from 'react'
import './index.css'

export default function EditOption(props) {
    return (
        <button 
            type='button'
            className={props.active ? 'edit-option active' : 'edit-option'}
            onClick={props.handleClick}
        >
            <p>{ props.name }</p>
        </button>        
    )
}
