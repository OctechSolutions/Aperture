import React, { useState, useEffect } from 'react'

import './Challenge.css'

import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"

import firebase from "firebase"
import { db, storage } from "../../firebase"

import { Avatar } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CallMadeIcon from '@material-ui/icons/CallMade'
import EditIcon from '@material-ui/icons/Edit'
import LockIcon from '@material-ui/icons/Lock'
import PublicIcon from '@material-ui/icons/Public'

export default function Challenge({name, description, hints, creator, creatorPhotoUrl, isPrivate, code, isAdmin, entries}) {

    const [anchorEl, setAnchorEl] = useState(null)

    const history = useHistory() // Related to react router.
    const open = Boolean(anchorEl) // Related to 3 Dots Menu.

    // To close the 3 dots menu.
    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    // To open the 3 dots menu.
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    return (
        <div className="challenge">
            {/* CHALLENGE HEADER = CREATOR, PUBLIC/PRIVATE, DELETE, EDIT, SEND INVITES. */}
            <div className="challenge_header"> 

                <div className="challenge_info">
                    {/* Creator avatar icon. */}
                    <div style={{ 
                        textDecoration: 'none', 
                        fontSize: '20px', 
                        color: "black" 
                    }}> 
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={() => { history.push(`/user/${creator}`) }} 
                        > {/* Redirect to creator profile when clicking creator's user icon. */}
                            <Avatar src={creatorPhotoUrl}></Avatar> 
                        </IconButton>

                        {name} {/* Challenge's name. */}

                        {/* Creator's name. */}
                        <Link style={{ 
                            textDecoration: 'none', 
                            fontSize: '15px', 
                            color: "black" 
                        }} to={`/user/${creator}`}> {/* Redirect to creator profile when clicking creator's name. */}
                            {" by " + creator}
                        </Link>
                        {/* Link is a component from react router that redirects to a particular route on click.
                            This dynamically creates a new page with /user/{username} and sends the user to that page. */}

                        {/* Public/Private Icon*/}
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={() => { console.log("Delete Challenge.") }} 
                        >{/* Toggle public or private if this user is admin.*/}
                            {isPrivate ? <LockIcon fontSize="small" /> : <PublicIcon fontSize="small" />} 
                        </IconButton>
                    </div>
                </div>

                {/* 3 Dots Menu. */}
                { isAdmin &&
                    <>
                        {/* 3 dots icon */}
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleMenuClick}
                        >
                            <MoreVertIcon />
                        </IconButton>

                        {/* 3 Dots menu content. */}
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={open}
                            onClose={handleMenuClose}
                        >
                            {/* Delete challenge. */}
                            <MenuItem key={"delete"} selected={false} onClick={() => { console.log("Delete challenge."); handleMenuClose() }}>
                                <ListItemIcon> <DeleteIcon /> </ListItemIcon>
                                Delete
                            </MenuItem>
                            
                            {/* Edit challenge. */}
                            <MenuItem key={"edit"} selected={false} onClick={() => { console.log("Edit challenge."); handleMenuClose() }}>
                                <ListItemIcon> <EditIcon /> </ListItemIcon>
                                Edit
                            </MenuItem>
                            
                            {/* Send invites. */}
                            <MenuItem key={"invite"} selected={false} onClick={() => { console.log("Send invites to join challenge."); handleMenuClose() }}>
                                <ListItemIcon> <CallMadeIcon /> </ListItemIcon>
                                Send Invites
                            </MenuItem>
                        </Menu>
                    </>
                }
            </div>
        
            {/* CHALLENGE DESRIPTION + HINTS + CHALLENGE CODE + VIEW ENTRIES. */}
            <div className="challenge_body">
                <br /><p><b>Description</b><br />{ description }</p>

                <br /><p><b>Hints</b><br />{ hints.toString().replaceAll(",", ", ") }</p>
                
                <br /><p><b>Challenge Code</b><br />{ code }</p>

                <br />
                <Button color="primary" onClick={() => {console.log("View challenge entries.")}}>
                    View Challenge Entries
                </Button>
            </div>
            
            {/* To print on console & test if values recieved. */}
            {
                console.log("name = ", name),
                console.log("description = ", description),
                console.log("hints = ", hints),
                console.log("creator = ", creator),
                console.log("creatorPhotoUrl = ", creatorPhotoUrl),
                console.log("isPrivate = ", isPrivate),
                console.log("code = ", code),
                console.log("isAdmin = ", isAdmin),
                console.log("entries = ", entries)
            }
        </div>
    )
}
