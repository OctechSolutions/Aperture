import React, { useState, useEffect } from 'react'
import { db, auth } from "../../../firebase"
import './Portfolio.css'
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

export default function Portfolio() {
    const portfolioRef =db.collection("portfolios")

    const [hasPortfolio, setHasPortfolio] = useState(false)

    /* Method that will set the value of state hasPortfolio to 
       true if the current user alredy has a portfolio and 
       will set it to false otherwise. */
    const checkIfPortfolioExists = () => {
        portfolioRef.where("creator", "==", auth.currentUser.displayName).get()
        .then( (userPortfolio) => { 
            console.log(userPortfolio.data)
            if(userPortfolio.data && hasPortfolio != true) {
                setHasPortfolio(true)
            } 
        })
    }

    useEffect(() => {checkIfPortfolioExists()}, [hasPortfolio])

    if(hasPortfolio) {
        return (
            <div className="portfolio">
                <p>Awesome! You have a portfolio!</p>
                <button className="edit-portfolio-btn btn btn-dark">
                    Edit
                </button>
            </div>
        )
    } else {
        return (
            <div className="no-portfolio">
                <p>Looks like your still on the hunt for the perfect portfolio!</p>
                <button className="create-portfolio-btn btn btn-dark">
                    I'm Ready! Lets Make One Now!
                </button>
            </div>
        )
    }
}
