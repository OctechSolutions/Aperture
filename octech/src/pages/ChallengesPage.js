import React from 'react'
import { useSelector } from "react-redux" // Related to routing.
import { selectUser } from "../features/userSlice" // Related to routing.

export default function ChallengesPage({ match }) {
    const user = useSelector(selectUser); // Related to routing.

    return (
        <div className="challengesPage">
            {console.log("Current user = " + match.params.id)}
            <h1>Looking for a Challenge?</h1>
        </div>
    )
}