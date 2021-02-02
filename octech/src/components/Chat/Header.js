import React from 'react';
import "./Header.css";
import {Avatar} from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search';
import { HelpOutline } from '@material-ui/icons';

function Header() {
    return (
        <div className="header">
            <div className='header_left'>
                {/* avatar for logged in user */}
                <Avatar
                    className="header_avatar"
                    alt='Place Holder'
                    // The user's avatar. Using Aperture logo for now..
                    src='https://i.pinimg.com/originals/c4/e5/9b/c4e59b804078ba134f5ac99d0ee068d9.jpg'
                    // Below 2 lines are for using user's avatar
                    // alt={user?.displayName}
                    // src={user?.photoURL}
                />  
                
                {/* Time icon */}
                {/* <AccessTimeIcon/> */}
            </div>
            <div className="header_search">
                {/* Search icon */}
                <SearchIcon/>
                {/* input */}
                <input placeholder="Search for Friends"/>
            </div>
            <div className="header_right">
                {/* help icon */}
                <HelpOutline/>
            </div>
        </div>
    )
}

export default Header