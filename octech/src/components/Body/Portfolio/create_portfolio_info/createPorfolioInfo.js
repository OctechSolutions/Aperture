
import React, { useState } from 'react'
import { db, auth } from '../../../../firebase'
import './createPortfolioInfo.css'

export default function CreatePortfolioInfo({ set_show_create_portfolio, set_has_portfolio}) {
    const ref = db.collection('portfolios') // A reference to the 'portfolios' collection from firebase firestore.
    const user = auth.currentUser // The current user.

    const [headshot, setHeadshot] = useState("") // Headshot image as a base 64 string.
    const [bestWork, setBestWork] = useState([]) // Array of best work images as base 64 strings.

    const handleChangeHeadshot = async(e) => {
        let reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]) // The image file is converted to its base64 equivalent string and is stored in reader as reader.result.
            reader.onloadend = function() { setHeadshot(reader.result) }
        } else {
            setHeadshot("")
        }
    }

    const handleChangeBestWork = async (e) => {
        let files = e.target.files

        for(var i = 0; i < files.length; i++){
            if(files[i]) { 
                let reader = new FileReader()
                if (files[i]) {
                    reader.readAsDataURL(files[i]) // The image file is converted to its base64 equivalent string and is stored in reader as reader.result.
                    reader.onloadend = function() { 
                        setBestWork((prevArr) => {
                            return [...prevArr, reader.result]
                        })
                    }
                } else {
                    setBestWork((prevArr) => {
                        return [...prevArr, ""]
                    })
                }
            }
        }


    }

    const addToDb = async (e) => {
        e.preventDefault() // Prevent the default reload behaviour.

        let newPortfolio = { // Information in the form as an object.
            creator: user.displayName,
            email: user.email,
            description: e.target.description.value,
            headshot: headshot,
            best_work: { imgBase64: bestWork },
            quote: e.target.quote.value,
            user_ref: user.uid
        }
        console.log(newPortfolio)
        try {
            ref.doc(user.uid).set(newPortfolio) // This adds a new post to the database.
            // set_show_create_portfolio(false) // Close the pop-up.
            set_has_portfolio(true) // A portfolio has been created.
        } catch (e) { console.log("Error! : ", e) }
    }

    return (
        <form className="create-portfolio-info" onSubmit={ addToDb }>

            {/* Quote Label & Input */}
            <label>A quote by you!</label>
            <input
                required
                name="quote"
                type="text"
                id="quote"
            />

            {/* Description Label & Input */}
            <label>Who are you? (A Short Description)</label>
            <input
                required
                name="description"
                type="text"
                id="description"
            />

            {/* Headshot Label and Image Input */}
            <label>Your headshot!</label>
            <input 
                required
                name="headshot"
                id="headshot" 
                type="file" 
                accept="image/*" 
                onChange={handleChangeHeadshot} 
            />

            {/* Best Work Label and Image Inputs */}
            <label>Images that showcase your Photography at its Best!</label>
            <input 
                required
                multiple
                name="bestWork"
                id="bestWork" 
                type="file" 
                accept="image/*" 
                onChange={handleChangeBestWork} 
            />

            {/* Submit Button */}
            <input
                name="submitBtn"
                className="btn btn-primary mb-3"
                type="submit"
                value="Create!"
                style={{ width: "100%" }}
            />

        </form>
    )
}