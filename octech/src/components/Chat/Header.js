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
                    alt='Mohamed Elfarash'
                    src=''
                    // alt={user?.displayName}
                    // src={user?.photoURL}
                />  
                
               
            </div>
            <div className="header_search">
               
                <SearchIcon/>
               
                <input placeholder="Search for Friends"/>
            </div>
            <div className="header_right">
               
                <HelpOutline/>
            </div>
        </div>
    )
}

export default Header