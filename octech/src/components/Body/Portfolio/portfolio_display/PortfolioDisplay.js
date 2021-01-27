import React, { useState, useEffect } from 'react'
import { db, auth } from "../../../../firebase"
import './PortfolioDisplay.css'
import '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import ImgSlideshow from '../../../ImgSlideshow/ImgSlideshow'

export default function PortfolioDisplay() {
    const portfoliosRef = db.collection("portfolios") // Reference to the portfolios collection.
    var query = portfoliosRef.where("user_ref", "==", auth.currentUser.uid); // Query to get current user's portfolio data.

    const [portfolio, setPortfolio] = useState(null)
    const [hasInfo, setHasInfo] = useState(false)

    const getPortfolio = () => {
        query.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                setPortfolio(doc.data())
            })
        })
    }

    useEffect(async () => {
        if(portfolio === null) {
            await getPortfolio()
        } else {
            if(!hasInfo){
                localStorage.setItem('quote', portfolio.quote)
                localStorage.setItem('description', portfolio.description)
                localStorage.setItem('headshot', portfolio.headshot)
                localStorage.setItem('bestWork', JSON.stringify(portfolio.best_work.imgBase64))
            }
            setHasInfo(true)
        }
    }, [portfolio]) 
    
    return (
        <div className="portfolio-display">
            <div 
                className="row quote"
                style={{
                    backgroundColor : "dodgerblue", 
                    padding: "2%",
                    borderRadius: "25px 0 25px 0",
                    display: "flex",
                    justifyContent: "center",
                    color: "white"
                }}
            > 
                <h3>"{localStorage.getItem("quote")}" - {auth.currentUser.displayName} </h3>  
            </div><br /> 
            <div className="row" id="bestwork-row">
                <ImgSlideshow imageArray={JSON.parse(localStorage.getItem("bestWork"))} />
            </div><br/>
            <div className="row heading-headshot">
                <div className="col-sm-4 headshotDiv"> 
                    <img id = "headshotImg" src={localStorage.getItem("headshot")} alt="Headshot"></img>
                </div>
                <div className="col-sm-8 description"> {localStorage.getItem("description")} </div>
            </div>
        </div>
    )
}
