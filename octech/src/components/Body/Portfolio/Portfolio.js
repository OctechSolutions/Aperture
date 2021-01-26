import React, { useState, useEffect } from 'react'
import { db, auth } from "../../../firebase"
import Modal from 'react-bootstrap/Modal'
import CreatePortfolioInfo from './create_portfolio_info/createPorfolioInfo'
import './Portfolio.css'
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

export default function Portfolio() {
    const portfolioDocRef = db.collection("portfolios").doc(auth.currentUser.uid)

    const [hasPortfolio, setHasPortfolio] = useState(false)
    const [showCreatePortfolio, setShowCreatePortfolio] = useState(false)
    const [portfolio, setPortfolio] = useState(null)

    /* Method that will set the value of state hasPortfolio to 
       true if the current user alredy has a portfolio and 
       will set it to false otherwise. */
    const checkIfPortfolioExists = async () => {
        portfolioDocRef.get().then(function(doc) {
            if (doc.exists) {
                if(!hasPortfolio) { setHasPortfolio(true) }
                setPortfolio(doc.data())
                console.log("Document data:", portfolio)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!")
                if(hasPortfolio) { setHasPortfolio(false) }
            }
        }).catch(function(error) {
            console.log("Error getting document:", error)
        })
    }

    useEffect(() => { checkIfPortfolioExists() }, [hasPortfolio])

    /* If the user has a portfolio, then display it and enable him/her
       to edit it. If the user does not have a portfolio, then 
       promt him to make one. */
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
            <div className="portfolio">
                <p>Looks like you're still on the hunt for the perfect portfolio!</p>
                <button 
                    className="create-portfolio-btn btn btn-dark"
                    onClick={() => {setShowCreatePortfolio(true)}}
                >
                    I'm Ready! Lets Make One Now!
                </button>
                <Modal
                    show={showCreatePortfolio}
                    keyboard={false}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header 
                        closeButton 
                        onClick={() => { setShowCreatePortfolio(false) }}
                    >
                        {/* Portfolio Creation Heading */}
                        <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}>
                            {auth.currentUser.displayName}, Kindly Let the World Know ...
                        </h4>
                    </Modal.Header>
                    
                    <Modal.Body>
                        <CreatePortfolioInfo 
                            set_show_create_portfolio={setShowCreatePortfolio}
                            set_has_portfolio={setHasPortfolio}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}
