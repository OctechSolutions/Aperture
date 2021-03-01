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
    const [loadChallenges, setLoadChallenges] = useState(true)

    useEffect(() => {
        // Load challenges (once).
        if(loadChallenges) { // If challenges are to be loaded, then load them.
            db.collection('challenges').get() // Get challenges from db.
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    let data = doc.data() // data = a single challenge object.

                    // Display only if ...
                    if(!data.isPrivate || // The challenge is not private.
                        data.creator === userName || // The user is the creator of the challenge.
                        Object.keys(data.invitees).includes(userName)){ // The user was invited to this challenge.
                        setChallenges(prevArr => { // Create a Challenge object and add to the list of challenges. 
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
            setLoadChallenges(false)
        }
    }, [loadChallenges])

    return (
        <div className="challengesPage">
            <h1>Looking for a Challenge?</h1> {/* Page heading. */}
            { challenges } {/* Render all challenge objects in the challenges list. */}
        </div>
    )
}