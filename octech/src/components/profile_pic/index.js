import React from 'react'
import './index.css'

export default function ProfilePic({imgSrc}) {
    return (
        <>
            <img className="profile-pic" src={imgSrc} alt="profile picture" />
        </>
    )
}
