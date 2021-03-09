import React, { useState, useEffect } from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"

import './Challenge.css'

import Post from "../Body/Post/Post"

import firebase from "firebase"
import { db } from "../../firebase"

import { Avatar } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
// import ListItemText from '@material-ui/core/ListItemText'
// import ListItem from '@material-ui/core/ListItem'
// import List from '@material-ui/core/List'
// import Divider from '@material-ui/core/Divider'
// import AppBar from '@material-ui/core/AppBar'
// import Toolbar from '@material-ui/core/Toolbar'
// import Slide from '@material-ui/core/Slide'
// import Typography from '@material-ui/core/Typography'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
// import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CallMadeIcon from '@material-ui/icons/CallMade'
import EditIcon from '@material-ui/icons/Edit'
import LockIcon from '@material-ui/icons/Lock'
import PublicIcon from '@material-ui/icons/Public'
import FileCopyIcon from '@material-ui/icons/FileCopy'
// import CloseIcon from '@material-ui/icons/Close'

export default function Challenge({user, name, description, hints, creator, creatorPhotoUrl, isPrivate, isAdmin, leader, startDate, endDate, setLoadChallenges}) {

    const [anchorEl, setAnchorEl] = useState(null)
    const [isPublic, setIsPublic] = useState(!isPrivate)
    const [showCopiedMessage, setShowCopiedMessage] = React.useState({ // Related to copied message popup.
        openCopiedMessage: false,
        vertical: 'top',
        horizontal: 'center',
    })
    const [entries, setEntries] = useState([])
    const [loadEntries, setLoadEntries] = useState(true)
    const [openOverlay, setOpenOverlay] = useState(false) // For entries overlay.
    

    const history = useHistory() // Related to react router.
    const open = Boolean(anchorEl) // Related to 3 Dots Menu.
    const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds)) // For sleep functionality. Reference = https://flaviocopes.com/javascript-sleep/
    const { vertical, horizontal, openCopiedMessage } = showCopiedMessage // Related to copied message popup.
    // const useStyles = makeStyles((theme) => ({ // For entries overlay.
    //     appBar: {
    //         position: 'relative',
    //     },
    //     title: {
    //         marginLeft: theme.spacing(2),
    //         flex: 1,
    //     },
    // }))
    // const Transition = React.forwardRef(function Transition(props, ref) { // For entries overlay.
    //     return <Slide direction="up" ref={ref} {...props} />;
    // });
    // const classes = useStyles() // For entries overlay.

    // Function to close the 3 dots menu.
    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    // Function to open the 3 dots menu.
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    // Function to open the full screen participating posts overlay.
    const handleOverlayClickOpen = () => {
        setOpenOverlay(true)
    }
    
    // Function to open the full screen participating posts overlay.
    const handleOverlayClose = () => {
        setOpenOverlay(false)
        setLoadEntries(true)
    }

    // Function to delete a challenge.
    const deleteChallenge = () => {
        db.collection("challenges").doc(name).delete().then(() => setLoadChallenges(true))
        
        // Delete this challenge from list of challenges of all participating posts.
        db.collection("posts").get().then((snapShot) => { 
            snapShot.forEach((postDoc) => {
                let challenges = postDoc.data().challenges
                if(challenges){
                    if(challenges.includes(name)) {
                        db.collection("posts").doc(postDoc.id).update({challenges: firebase.firestore.FieldValue.arrayRemove(name)})
                        .then(() => console.log("Challenge deleted = " + name))
                    }
                }
            })
        })
    }

    // Function that displays the copied to clipboard message.
    const displayCodeToClipboardDialog = () => {
        setShowCopiedMessage({ vertical: 'bottom', horizontal: 'center', openCopiedMessage: true })
        sleep(3000).then(() => setShowCopiedMessage({ vertical: 'bottom', horizontal: 'center', openCopiedMessage: false }))
        console.log(name + " copied to clipboard!")
    }

    // Funtion that loads all the posts participating in this challenge.
    const loadChallengeEntries = () => {
        setEntries([])
        // Add all posts that have this challenge in its challenges list to entries array.
        db.collection("posts").get()
        .then((postDocArr) => {
            postDocArr.forEach((postDoc) => {
                let postChallenges = postDoc.data().challenges
                if(postChallenges) {
                    if(postChallenges.includes(name)){
                        // console.log(postDoc.data())
                        setEntries((prev) => [
                            ...prev,
                            <Post
                                key={postDoc.id}
                                id={postDoc.id}
                                name={postDoc.data().name}
                                description={postDoc.data().description}
                                message={postDoc.data().message}
                                photoUrl={postDoc.data().photoUrl}
                                largeGifs={postDoc.data().largeGifs}
                                comments={postDoc.data().comments}
                                hasCoordinates={postDoc.data().hasCoordinates}
                                lat={postDoc.data().lat}
                                lng={postDoc.data().lng}
                                channelBy={postDoc.data().channelBy}
                                viewingUser={user}
                                star={postDoc.data().stars}
                                totalStar={postDoc.data().totalStars}
                                isPrivate={postDoc.data().isPrivate}
                                timestamp={postDoc.data().timestamp}
                                type={postDoc.data().type}
                                isForumPost = {Boolean(postDoc.data().type)}
                                challenges={postChallenges}
                            >
                            </Post>
                        ])
                    }
                }
            })
        })
    }

    useEffect(() => {
        if(loadEntries) { loadChallengeEntries(); setLoadEntries(false)}
        // eslint-disable-next-line
    }, [loadEntries])

    return (
        <div className="challenge" >
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

                        {/* Copy to Clipboard button */}
                        <CopyToClipboard text={name} onCopy={displayCodeToClipboardDialog}>
                            <IconButton color="primary" aria-label="copy to clipboard"> <FileCopyIcon /> </IconButton>
                        </CopyToClipboard>

                        {/* Copied to clipboard message */}
                        <Snackbar
                            anchorOrigin={{ vertical, horizontal }}
                            open={openCopiedMessage}
                            onClose={() => setShowCopiedMessage({ ...showCopiedMessage, openCopiedMessage: false })}
                            message={"Copied \"" + name + "\" to Clipboard!"}
                            key={vertical + horizontal}
                        />

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
                            onClick={() => { 
                                if(isAdmin){
                                    db.collection("challenges").doc(name).update({isPrivate: isPublic})
                                    setIsPublic(!isPublic)
                                }
                            }} 
                        >{/* Toggle public or private if this user is admin.*/}
                            {!isPublic ? <LockIcon fontSize="small" /> : <PublicIcon fontSize="small" />} 
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
                            <MenuItem key={"delete"} selected={false} onClick={() => { deleteChallenge(); handleMenuClose() }}>
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
                <p><b>Description</b><br />{ description }</p>

                <p><b>Hints</b><br />{ hints.toString().replaceAll(",", ", ") }</p>
                
                <p>
                    <b>Duration: </b>{ startDate } to { endDate }
                </p>

                <Button color="primary" onClick={ handleOverlayClickOpen }>
                    View Challenge Entries
                </Button>
            </div>
            
            {/* CHALLENGE LEADER / WINNER */}
            <div className="winner">
                { 
                    leader !== "" ? // Display a leader / winner if one exists.
                    (new Date() < new Date(endDate))? <p>Leader: </p>: <p>Winner: </p>
                    :<></>
                }
                {leader}
            </div>
       
            {/* FULLSCREEN OVERLAY TO DISPLAY PARTICIPATING POSTS */}
            <Dialog open={openOverlay} onClose={handleOverlayClose} aria-labelledby="form-dialog-title" fullScreen="true">
                <DialogTitle id="form-dialog-title">Participating Posts</DialogTitle>
                <DialogContent>
                    {
                        entries.length === 0 ?
                        <h3 style={{display:'flex', justifyContent:"center", padding:"10% 5%", color:"grey"}}>No posts yet!</h3> :
                        entries
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOverlayClose} color="primary"> Done </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
