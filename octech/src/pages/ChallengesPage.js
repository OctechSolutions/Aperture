import React, { useState, useEffect } from 'react'

import { useSelector } from "react-redux" // Related to routing.
import { selectUser } from "../features/userSlice" // Related to routing.

import firebase from "firebase";
import { db, storage } from "../firebase";
import Challenge from '../components/Challenge/Challenge';

export default function ChallengesPage({ match }) {
    const user = useSelector(selectUser) // Related to routing.
    const userName = user.displayName // Name of current users.

    const [challenges, setChallenges] = useState([])

    useEffect(() => {
        // Load challenges (once).
        if (challenges.length === 0){
            db.collection('challenges').get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    let data = doc.data()
                    // console.log("data = ", data)

                    if(!data.isPrivate || data.creator === userName){
                        setChallenges(prevArr => { 
                            return prevArr.concat([
                                <Challenge
                                    name={data.name}
                                    description={data.description}
                                    hints={data.hints} 
                                    creator={data.creator}
                                    creatorPhotoUrl={data.creatorPhotoUrl}
                                    isPrivate={data.isPrivate}
                                    code={data.code} 
                                    isAdmin={data.creator === userName} 
                                    entries={data.entries}
                                > </Challenge>
                            ])
                        })
                    }
                })
            })
        }
        // challenges.map((obj) => {console.log("obj = " + obj)})
        // console.log("challenges = " + challenges)
    }, [challenges])

    return (
        <div className="challengesPage">
            <h1>Looking for a Challenge?</h1> {/* Page heading. */}
            { challenges }
        </div>
    )
}