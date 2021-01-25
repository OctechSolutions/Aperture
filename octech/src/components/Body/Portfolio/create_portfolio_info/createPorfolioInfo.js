
import React from 'react'
import './createPortfolioInfo.css'

export default function CreatePortfolioInfo() {
    return (
        <form className="create-portfolio-info">
            <label>A quote by you!</label>
            <input
                    name="quote"
                    type="text"
                    id="quote"
            />

            <label>Who are you? (A Short Discription)</label>
            <input
                    name="description"
                    type="text"
                    id="description"
            />

            <label>Your headshot!</label>
            <input 
                name="headshot"
                id="headshot" 
                type="file" 
                accept="image/*" 
                onChange={() => {console.log("Must handleUpload headshot")}} 
            />

            <label>Images that showcase your Photography at its Best!</label>
            <input 
                multiple
                name="bestWorkImages"
                id="bestWorkImages" 
                type="file" 
                accept="image/*" 
                onChange={() => {console.log("Must handleUpload best work.")}} 
            />

            <input
                name="submitBtn"
                className="btn btn-primary mb-3"
                type="submit"
                value="Create!"
                style={{ width: "100%" }}
                onClick={console.log("Must handleSubmit.")}
            />
        </form>
    )
}