import React, { useState } from 'react'
import { db, auth } from '../../../../firebase'
import "./AddToPortfolioBtn.css"

export default function AddToPortfolioBtn({ postId }) {
    const portfoliosRef = db.collection('portfolios') // A reference to the 'portfolios' collection from firebase firestore.
    const postImagesRef = db.collection('postImages') // A reference to the 'postImages' collection from firebase firestore.
    const user = auth.currentUser // The current user.

    /* Updates the portfolio with the given img list. */
    const updatePortfolio = (imgArr) => {
        portfoliosRef.doc(user.uid).update({
            best_work: {imgBase64 : imgArr}
        })
    }

    /* Adds the post images to the portfolio images. */
    const appendToPortfolioImgs = (imgArr) => {
        let query = portfoliosRef.doc(user.uid)
        query.get()
        .then(function(doc) {
            if (doc.exists) {
                let portfolioImgArr = doc.data().best_work.imgBase64 // Array of images already in the portfolio.
                imgArr.forEach((postImg) => {
                    // If the post images are not already in the portfolio, only then are they to be added.
                    if (!(portfolioImgArr.filter(portfolioImg => portfolioImg === postImg).length > 0)) {
                        portfolioImgArr.push(postImg)
                    }
                })
                updatePortfolio(portfolioImgArr)
            } else {
                // doc.data() will be undefined in this case
                console.log("This user with id = " + user.id + " has no such portfolio!")
            }
        }).catch(function(error) {
            console.log("Error getting document:", error)
        })
    }

    /* Fetches the post documents from the postImages collection and stores
       them in the imgArr. Then, this method calls appendToPortfolioImgs(imgArr). */
    const getPostImgs = () => {
        let query = postImagesRef.where("ref", "==", postId)
        query.get()
        .then(function(querySnapshot) {
            let imgArr = []
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                imgArr.push(doc.data().url)
            })
            appendToPortfolioImgs(imgArr)
        })
        .catch(function(error) {
            console.log("Error getting images: ", error);
        })
    }

    const addToPortfolio = async () => {
        getPostImgs()
    }
    
    return (
        <div className="add-to-portfolio-div">
            <button 
                className="add-to-portfolio-btn"
                onClick={addToPortfolio}
            >
                Add to Portfolio
            </button>
        </div>
    )
}
