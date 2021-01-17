import React from 'react'
import './profilePic.css'

export default function ProfilePic({imgSrc}) {
    return (
        <>
            <img className="profile-pic" src={imgSrc} alt="profile picture" />
        </>
    )
}
