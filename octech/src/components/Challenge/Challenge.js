import React, { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import Modal from 'react-bootstrap/Modal'
// import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Camera, { FACING_MODES } from "react-html5-camera-photo"
import Countdown from 'react-countdown'

import './Challenge.css'

// import Post from "../Body/Post/Post"
import ChallengePost from "./ChallengePost"

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
import InputBase from '@material-ui/core/InputBase'
import Cropper from "react-cropper"
import Slider from '@material-ui/core/Slider'
import ImageGallery from "../Body/Feed/ImageGallery"
import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CallMadeIcon from '@material-ui/icons/CallMade'
import EditIcon from '@material-ui/icons/Edit'
import LockIcon from '@material-ui/icons/Lock'
import PublicIcon from '@material-ui/icons/Public'
import FileCopyIcon from '@material-ui/icons/FileCopy'
// import CloseIcon from '@material-ui/icons/Close'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ImageIcon from "@material-ui/icons/Image"
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera"
import SendIcon from '@material-ui/icons/Send'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function Challenge({ user, name, description, hints, creator, creatorPhotoUrl, isPrivate, isAdmin, leader, startDate, endDate, setLoadChallenges }) {

    const [anchorEl3Dots, setAnchorEl3Dots] = useState(null)
    const [isPublic, setIsPublic] = useState(!isPrivate)
    const [showCopiedMessage, setShowCopiedMessage] = React.useState({ // Related to copied message popup.
        openCopiedMessage: false,
        vertical: 'top',
        horizontal: 'center',
    })
    const [entries, setEntries] = useState([])
    const [loadEntries, setLoadEntries] = useState(true)
    const [openOverlay, setOpenOverlay] = useState(false) // For entries overlay.
    const [challengeComplete, setChallengeComplete] = useState(false)
    const [userData, setUserData] = useState({})

    useEffect(() => {
        // helper.current.scrollIntoView({ behavior: 'smooth' });

        db.collection("users").doc(user.displayName).get().then(doc => {
            if (doc.exists) {
                setUserData({
                    id: doc.id,
                    data: doc.data()
                })
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting user data:", error)
        });
    }, [user.displayName])

    const useStyles = makeStyles(
        (theme) => ({
            appBar: { // For entries overlay.
                position: 'relative',
            },
            title: {
                marginLeft: theme.spacing(2),
                flex: 1,
            },
            root: { // For add post.
                backgroundColor: theme.palette.background.paper,
                width: 500,
                position: 'relative',
                minHeight: 200,
            },
            fab: {
                margin: 0,
                top: 'auto',
                right: 'auto',
                bottom: 45,
                left: 'auto',
                position: 'fixed',
                zIndex: 100
            },
            input: {
                marginLeft: theme.spacing(2),
                flex: 1,
            },
        })
    )
    const classes = useStyles()
    const history = useHistory() // Related to react router.
    const open = Boolean(anchorEl3Dots) // Related to 3 Dots Menu.
    const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds)) // For sleep functionality. Reference = https://flaviocopes.com/javascript-sleep/
    const { vertical, horizontal, openCopiedMessage } = showCopiedMessage // Related to copied message popup.
    // const Transition = React.forwardRef(function Transition(props, ref) { // For entries overlay.
    //     return <Slide direction="up" ref={ref} {...props} />
    // })
    const endDateObj = new Date(endDate) // Date object from the endDate string passed.

    // Function to close the 3 dots menu.
    const handleMenuClose = () => {
        setAnchorEl3Dots(null);
    }

    // Function to open the 3 dots menu.
    const handleMenuClick = (event) => {
        setAnchorEl3Dots(event.currentTarget);
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
        db.collection("challengePosts").where("challenge", "==", name)
            .get().then((snapShot) => {
                snapShot.forEach((postDoc) => {
                    if (postDoc) { db.collection("challengePosts").doc(postDoc.id).delete() }
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
        db.collection("challengePosts").orderBy('timestamp', 'desc').get()
            .then((postDocArr) => {
                postDocArr.forEach((postDoc) => {
                    let postChallenge = postDoc.data().challenge
                    if (postChallenge) {
                        if (postChallenge === name) {
                            //console.log("postDoc.data() = " + postDoc.data().ref)
                            setEntries((prev) => [
                                ...prev,
                                <ChallengePost
                                    key={postDoc.data().ref}
                                    user={user}
                                    caption={postDoc.data().caption}
                                    star={postDoc.data().stars}
                                    totalStar={postDoc.data().totalStars}
                                    creator={postDoc.data().creator}
                                    creatorPhotoUrl={postDoc.data().creatorPhotoUrl}
                                    imageSrc={postDoc.data().imageSrc}
                                    style={postDoc.data().style}
                                    timestamp={postDoc.data().timestamp}
                                    id={postDoc.data().ref}
                                    loadChallengeEntries={loadChallengeEntries}
                                    challengeName={name}
                                ></ChallengePost>
                            ])
                        }
                    }
                })
            })
    }

    // To properly format the countdown clock.
    const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            setChallengeComplete(true)
            db.collection("challenges").doc(name).update({ hasEnded: true })
            return "Challenge Ended!"
        }
        else { return days + " days : " + hours + " hrs : " + minutes + " mins : " + seconds + " secs" }
    }

    // For NEW POST ----------------------------------------------------
    const DEFAULT_EDIT_OPTIONS = [
        {
            name: 'Brightness',
            property: 'brightness',
            value: 100,
            range: { min: 0, max: 200 },
            unit: '%'
        },
        {
            name: 'Contrast',
            property: 'contrast',
            value: 100,
            range: { min: 0, max: 200 },
            unit: '%'
        },
        {
            name: 'Saturation',
            property: 'saturate',
            value: 100,
            range: { min: 0, max: 200 },
            unit: '%'
        },
        {
            name: 'Grayscale',
            property: 'grayscale',
            value: 0,
            range: { min: 0, max: 100 },
            unit: '%'
        },
        {
            name: 'Hue',
            property: 'hue-rotate',
            value: 0,
            range: { min: 0, max: 360 },
            unit: 'deg'
        }
    ]
    let selectedUsers = []
    const [caption, setCaption] = useState("")
    const [, setFile] = useState(null)
    const [inputImg, setInputImg] = useState("")
    const [selectedInputImg, setSelectedInputImg] = useState({})
    const [cameraActive, setCameraActive] = useState("")
    const [editOptions, setEditOptions] = useState(DEFAULT_EDIT_OPTIONS)
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
    const selectedOption = editOptions[selectedOptionIndex]
    const [, setNohuman] = useState(false)
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [, setIsPrivatePost] = useState(false)
    const [showPostComponent, setShowPostComponent] = useState(false)

    const cocoSsd = require('@tensorflow-models/coco-ssd')

    const [cropper, setCropper] = useState("")
    const [cropping, setCropping] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [openCaptionError, setOpenCaptionError] = useState(false)
    const [add, setAdd] = useState(false)

    const Compress = require('compress.js')

    // Function to open the post added snackbar.
    const handleSnackbarOpen = () => {
        setOpenSnackbar(true)
    }

    // Function to close the post added snackbar.
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') { return }
        setOpenSnackbar(false)
    }

    // Function related to the snackbar.
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    // Function resets all state variables to blank.
    const resetVals = () => {
        setInputImg("") // When the post is submitted the input image is set to an empty string removing the preview of the image and providing a fresh canvas for the next post.
        setEditOptions(DEFAULT_EDIT_OPTIONS) // This sets the slider values for editing the image to its default once the post is submitted which avoids applying old filters to the next image that is uploaded.
        setCaption("") // On posting the input value is set to an empty string.
        setCameraActive("")
        setShowPostComponent(false)
        setCropping("false")
        setCameraActive("")
        setSelectedInputImg("")
    }

    // Function that handles case when user cancels editing.
    const editingCancelled = async () => {
        setInputImg("");
        setEditOptions(DEFAULT_EDIT_OPTIONS);
        setIsPrivatePost(false);
    }

    // Function that handles events once an image has been input.
    const handleImageInputChange = (e) => { // When a file is uploaded this function is called

        e.preventDefault()
        // console.log(e.target.files[0])
        setEditOptions(DEFAULT_EDIT_OPTIONS)

        setFile(e.target.files[0])

        const compress = new Compress()
        compress.compress([e.target.files[0]], {
            size: 0.7, // the max size in MB, defaults to 2MB
            quality: .65, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
        }).then((data) => {

            // returns an array of compressed images
            console.log("compressed data = " + data[0].prefix + data[0].data)
            var compressedb64 = data[0].prefix + data[0].data
            setInputImg(compressedb64)

            // Human Detection.
            setLoading(true)
            cocoSsd.load().then((model) => {
                // detect objects in the image.
                const img = document.getElementById("img")
                model.detect(img).then(
                    (predictions) => {
                        console.log("Predictions: ", predictions)
                        if (predictions.length) {
                            predictions.forEach((prediction) => {
                                if (prediction.class === "person") {
                                    setInputImg("")
                                    console.log("HUMAN DETECTED!!!")
                                    setShow(true)
                                }
                                else {
                                    setNohuman(true)
                                }
                            })
                        }
                        else {
                            setNohuman(true)
                        }
                        setLoading(false)
                        setCropping(true)
                    }
                )
            })
        })

        setCameraActive("") // Camera is not active.
    }

    // Function that opens a camera.
    const openCamera = (e) => { // On clicking the camera button this function is called
        e.preventDefault()
        setCameraActive("active") // The camera state is set to active which renders the camera component 
    }

    // Function that closes the camera.
    const closeCamera = (e) => {
        setCameraActive("") // Setting this to an empty state stops the rendering of the camera component.
    }

    // Handle taking photo with camera.
    async function handleTakePhoto(dataUri) {
        // console.log(dataUri);
        setInputImg(dataUri)
        setCameraActive("");
        setLoading(true);
        await inputImg;
        cocoSsd.load().then((model) => {

            // detect objects in the image.

            const img = document.getElementById("img")
            model.detect(img).then((predictions) => {

                console.log("Predictions: ", predictions)
                if (predictions.length) {
                    predictions.forEach((prediction) => {
                        if (prediction.class === "person") {
                            setInputImg("")
                            console.log("HUMAN DETECTED!!!")
                            setShow(true)
                        }
                        else {
                            setNohuman(true)
                        }
                    })
                }
                else {
                    setNohuman(true)
                }
                setLoading(false)
                setCropping(true)
            })
        })
    }

    // Function that deals with changes when the image edit slider is changed.
    const handleSliderChange = (value) => {
        setEditOptions(prevEditOptions => {
            return (
                (prevEditOptions.map((option, index) => {

                    if (index !== selectedOptionIndex) {
                        return option
                    }
                    return { ...option, value: value }
                }))
            )
        })
    }

    // Gets the css style of image being edited.
    const getImageStyle = () => {
        const filters = editOptions.map(option => {
            return `${option.property}(${option.value}${option.unit})`
        })
        return { filter: filters.join(` `) }
    }

    // Function that handles values of the crop.
    const getCropData = async () => {
        if (typeof cropper !== "undefined") {
            setInputImg(await cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.5))
            setCropping(false)
        }
    }

    // Function that is called once the user is done editting.
    const editingDone = async () => {
        setNohuman(false)
        if (inputImg) {
            // setInputImgs(inputImgs.concat(inputImg))
            setSelectedInputImg({
                src: inputImg,
                style: getImageStyle()
            })
            setInputImg("")
            setEditOptions(DEFAULT_EDIT_OPTIONS)
        }
    }

    // Function that is called when a new post is submitted.
    const sendPost = async (e) => {
        e.preventDefault() // This is to prevent the default behaviour of submitting a form.

        // If the post does not have a caption, then ask user to enter one.
        if (caption === "") { setOpenCaptionError(true) }

        else {
            if (selectedInputImg !== {}) {
                const ref = db.collection('challengePosts').doc() // A reference to the next entry to the database is created in advance.
                ref.set({ // This adds a new post to the database.
                    key: ref.id,
                    caption: caption,
                    imageSrc: selectedInputImg.src,
                    style: selectedInputImg.style,
                    creator: creator,
                    creatorPhotoUrl: creatorPhotoUrl || "",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    stars: {},
                    totalStars: 0,
                    challenge: name,
                    ref: ref.id,
                    hasEnded: false
                }).then(() => {
                    setLoadEntries(true)
                    handleSnackbarOpen()
                    resetVals()
                })
            }
        }
    }

    // Opens the edit options drop down list.
    const handleEditOptionsMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    // Closes the edit options drop down list.
    const handleEditOptionsClose = () => {
        setAnchorEl(null);
    }

    // -----------------------------------------------------------------

    useEffect(() => {
        if (loadEntries) { loadChallengeEntries(); setLoadEntries(false); resetVals() }
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
                        color: "black",
                        display: "flex",

                    }}>
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={() => { history.push(`/user/${creator}`) }}
                        > {/* Redirect to creator profile when clicking creator's user icon. */}
                            <Avatar src={creatorPhotoUrl}></Avatar>
                        </IconButton>
                        <div style={{ display: "flex", flexDirection: "column", padding: "0px" }}>
                            <div style={{ padding: "0px" }}>
                                {name} {/* Challenge's name. */}
                                {/* Public/Private Icon*/}
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={() => {
                                        if (isAdmin) {
                                            db.collection("challenges").doc(name).update({ isPrivate: isPublic })
                                            setIsPublic(!isPublic)
                                        }
                                    }}
                                >{/* Toggle public or private if this user is admin.*/}
                                    {!isPublic ? <LockIcon fontSize="small" /> : <PublicIcon fontSize="small" />}
                                </IconButton>
                                {/* Copy to Clipboard button */}
                                <CopyToClipboard text={name} onCopy={displayCodeToClipboardDialog}>
                                    <IconButton color="primary" aria-label="copy to clipboard"> <FileCopyIcon /> </IconButton>
                                </CopyToClipboard>
                            </div>
                            <div style={{ marginTop: "-15px" }}>
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
                            </div>
                        </div>

                        {/* Copied to clipboard message */}
                        <Snackbar
                            anchorOrigin={{ vertical, horizontal }}
                            open={openCopiedMessage}
                            onClose={() => setShowCopiedMessage({ ...showCopiedMessage, openCopiedMessage: false })}
                            message={"Copied \"" + name + "\" to Clipboard!"}
                            key={vertical + horizontal}
                        />
                    </div>
                </div>
                <Modal
                    show={add}
                    onHide={() => { setAdd(false) }}
                    keyboard={false}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton onClick={() => { setShow(false) }}>
                        <h5>
                            {`Invite friends to ${name}`}
                        </h5>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            <>
                                <Autocomplete
                                    multiple
                                    autoComplete={true}
                                    autoSelect={true}
                                    clearOnEscape={true}
                                    fullWidth={true}
                                    autoHighlight={true}
                                    onChange={(event, selectedUser) => {
                                        selectedUsers = selectedUser
                                    }}
                                    id="search"
                                    options={userData.data ? userData.data.friends : []}
                                    getOptionLabel={option => option.name}
                                    renderOption={(option) => {
                                        return (
                                            <ListItem >
                                                <ListItemIcon>
                                                    <Avatar alt={option.name} src={option.photoUrl} />
                                                </ListItemIcon>
                                                <ListItemText primary={option.name} primaryTypographyProps={{ noWrap: true }} />
                                            </ListItem>
                                        )
                                    }
                                    }
                                    disableClearable
                                    forcePopupIcon={false}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search"
                                            margin="normal"
                                            variant="outlined"
                                            style={{
                                                position: "sticky",
                                                zIndex: 100,
                                                top: 200,
                                                backgroundColor: "white",
                                                marginBottom: "20px"
                                            }}
                                        />
                                    )}
                                />
                                <center>
                                    <IconButton
                                        aria-label="invite to challenge"
                                        onClick={() => {
                                            if (selectedUsers.length > 0) {
                                                console.log(selectedUsers);
                                            }
                                        }}
                                        onMouseDown={() => { }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </center>
                            </>
                        }
                    </Modal.Body>
                </Modal>
                {/* 3 Dots Menu. */}
                {isAdmin &&
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
                            anchorEl={anchorEl3Dots}
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
                            <MenuItem key={"invite"} selected={false} onClick={() => { console.log("Send invites to join challenge."); handleMenuClose(); setAdd(true) }}>
                                <ListItemIcon> <CallMadeIcon /> </ListItemIcon>
                                Send Invites
                            </MenuItem>
                        </Menu>
                    </>
                }
            </div>

            {/* CHALLENGE DESRIPTION + HINTS + CHALLENGE CODE + VIEW ENTRIES. */}
            <div className="challenge_body">
                <p><b>Description</b><br />{description}</p>
                {(hints !== ",,") && <p><b>Hints</b><br />{hints.toString().replaceAll(",", ", ")}</p>}
                <p><b>Duration</b><br />{startDate} - {endDate}</p>
                <p><b>Countdown to Challenge End</b><br />
                    <Countdown date={Date.now() + (endDateObj - Date.now())} renderer={countdownRenderer} /></p>
                {/* Add new post to challenge and view entries button. */}
                <div className="buttons" style={{ display: "flex", justifyContent: "space-evenly" }}>
                    {   // Display option to add to a challenge only if its not completed yet.
                        !challengeComplete &&
                        <IconButton aria-label="addPostToChallenge" color="primary" onClick={() => { setShowPostComponent(true) }}>
                            <AddCircleOutlineIcon fontSize="large" />
                        </IconButton>
                    }
                    <IconButton aria-label="viewEntries" color="primary" onClick={handleOverlayClickOpen}>
                        <VisibilityIcon fontSize="large" />
                    </IconButton>
                </div>
            </div>

            {/* CHALLENGE LEADER / WINNER */}
            <div className="winner">
                {
                    leader !== "" ? // Display a leader / winner if one exists.
                        (new Date() < new Date(endDate)) ? <p>Leader: </p> : <p>Winner: </p>
                        : <></>
                }
                {leader}
            </div>

            {/* FULLSCREEN OVERLAY TO DISPLAY PARTICIPATING POSTS */}
            <Dialog open={openOverlay} onClose={handleOverlayClose} aria-labelledby="form-dialog-title" fullScreen={true} PaperProps={{
                style: {
                    backgroundColor: 'whitesmoke',
                    boxShadow: 'none',
                },
            }}>
                {/* <DialogTitle id="form-dialog-title">Participating Posts</DialogTitle> */}
                <DialogTitle id="form-dialog-title">
                    <div>
                        <center><h1>{name}</h1></center>
                        <center>
                            <Countdown date={Date.now() + (endDateObj - Date.now())} renderer={countdownRenderer} />
                        </center>
                    </div>

                </DialogTitle>
                <DialogContent>
                    {
                        entries.length === 0 ?
                            <h3 style={{ display: 'flex', justifyContent: "center", padding: "10% 5%", color: "grey" }}>No posts yet!</h3> :
                            entries
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOverlayClose} color="primary"> Done </Button>
                </DialogActions>
            </Dialog>

            {/* POP UP MODAL TO ADD A NEW CHALLENGE POST */}
            <Modal
                show={showPostComponent}
                onHide={() => { setShowPostComponent(false); resetVals(); }}
                keyboard={false}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={() => { setShowPostComponent(false) }}>
                    <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}> Posting as {user.displayName} </h4>
                </Modal.Header>

                <Modal.Body>
                    <div className="feed_inputContainer">
                        <div className="feed_input">
                            <IconButton aria-label="more"> <Avatar src={user.photoUrl}></Avatar> </IconButton> {/* User's Avatar. */}
                            <form onSubmit={(e) => { e.preventDefault() }}> {/* Form containing input options. */}
                                <InputBase
                                    className={classes.caption}
                                    placeholder="Caption"
                                    inputProps={{ 'aria-label': 'caption' }}
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)} // When the input is changed the caption state variable is updated.
                                />
                            </form>
                        </div>

                        {/* Image Upload */}
                        <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "15px" }}>
                            {   // To upload an image file.
                                !inputImg &&
                                <div className="upload-btn-wrapper">
                                    {/* Add image file input. */}
                                    <input type="file" name="myfile" id="myFile" accept="image" onChange={handleImageInputChange} style={{ opacity: "0" }} />
                                    <label htmlFor="myFile">
                                        <IconButton aria-label="upload image" component="span"> <ImageIcon fontSize="large" /> </IconButton>
                                    </label>
                                </div>
                            }

                            {   // To upload image using camera.
                                !inputImg &&
                                <label>
                                    <IconButton
                                        aria-label="open camera"
                                        component="span"
                                        onClick={openCamera}
                                    >
                                        <PhotoCameraIcon fontSize="large" />
                                    </IconButton>
                                </label>
                            }

                            {/*Modal using which to take picture. */}
                            <Modal
                                show={Boolean(cameraActive)}
                                onHide={() => { setCameraActive("") }}
                                keyboard={false}
                                size="xl"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                            >
                                <Modal.Body>
                                    {
                                        cameraActive &&
                                        <div className="camera">
                                            <br></br>
                                            <Camera // Camera API
                                                isImageMirror={false}
                                                onTakePhoto={(dataUri) => { handleTakePhoto(dataUri) }}
                                                idealFacingMode={FACING_MODES.ENVIRONMENT}
                                                imageCompression={0.97}
                                            />
                                            <button onClick={closeCamera}>Close Camera</button>
                                        </div>
                                    }
                                </Modal.Body>
                            </Modal>

                        </div>

                        {   // Human Detected Error.
                            show &&
                            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                                <Alert.Heading> Oh snap! Human Detected! </Alert.Heading>
                                <p> The image uploaded had a Human detected in it! </p>
                            </Alert>
                        }

                        {/* Modal to display input image. */}
                        <Modal
                            show={inputImg}
                            onHide={() => { setInputImg(""); }}
                            keyboard={false}
                            size="xl"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Body>
                                {
                                    inputImg &&
                                    <>
                                        {
                                            !loading && cropping &&
                                            <div> {/* Cropper. */}
                                                <Cropper
                                                    style={{ height: 400, width: "100%" }}
                                                    initialAspectRatio={1}
                                                    src={inputImg}
                                                    viewMode={1}
                                                    guides={true}
                                                    minCropBoxHeight={10}
                                                    minCropBoxWidth={10}
                                                    background={false}
                                                    responsive={true}
                                                    autoCropArea={1}
                                                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                                    onInitialized={(instance) => { setCropper(instance); }}
                                                />
                                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                                    <Button color="primary" onClick={getCropData}>Crop Image</Button>
                                                    <Button onClick={() => { setCropping(false) }}>Continue without cropping</Button>
                                                </div>
                                            </div>
                                        }

                                        <br />

                                        {   // View image for editing.
                                            inputImg &&
                                            <div className="photoEditor"> {/* Div in which to view the photo. */}
                                                <img src={inputImg} className="previewImage" id="img" alt="Preview" style={getImageStyle()}></img>
                                                {
                                                    !loading &&
                                                    <div>
                                                        <br /><br />
                                                        {/* Image edit options. */}
                                                        <Button aria-controls="simple-menu" aria-haspopup="true" endIcon={<ExpandMoreIcon />} onClick={handleEditOptionsMenuClick} centered>
                                                            {editOptions[selectedOptionIndex].name}
                                                        </Button>
                                                        <Menu
                                                            id="simple-menu"
                                                            anchorEl={anchorEl}
                                                            keepMounted
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleEditOptionsClose}
                                                        >
                                                            {
                                                                editOptions.map((option, index) => {
                                                                    return (
                                                                        <MenuItem key={index} onClick={() => { setSelectedOptionIndex(index); setAnchorEl(null) }}>
                                                                            {option.name}
                                                                        </MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Menu><br></br>

                                                        {/* Slider to adjust edit values. */}
                                                        <Slider
                                                            min={selectedOption.range.min}
                                                            max={selectedOption.range.max}
                                                            value={selectedOption.value}
                                                            onChange={(event, result) => { handleSliderChange(result) }}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </>
                                }

                                {
                                    loading &&
                                    <div> {/* Loading image spinner. */}
                                        <Spinner animation="border" role="status"></Spinner>
                                        <span>{'  '}Scanning Image...</span>
                                    </div>
                                }

                                {
                                    !loading && !cropping &&
                                    <div className="buttons" style={{ justifyContent: "space-evenly" }}> {/* Editing Done / Cancel button. */}
                                        <Button variant="contained" onClick={editingDone}>Add Image</Button>
                                        <Button variant="contained" onClick={editingCancelled}>Cancel</Button>
                                    </div>
                                }

                            </Modal.Body>
                        </Modal>

                        {selectedInputImg && <ImageGallery sliderImages={[selectedInputImg]} />}
                        {
                            selectedInputImg &&
                            <center style={{ marginTop: "15px" }}> {/* Post button. */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    endIcon={<SendIcon />}
                                    onClick={sendPost}
                                >
                                    <b>Post</b>
                                </Button>
                            </center>
                        }
                    </div>
                </Modal.Body>
            </Modal>

            {/* Post added success message alert! */}
            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Post added to challenge "{name}" :)
                </Alert>
            </Snackbar>

            {/* Post must have a caption error message! */}
            <Snackbar open={openCaptionError} autoHideDuration={6000} onClose={() => setOpenCaptionError(false)}>
                <Alert onClose={() => setOpenCaptionError(false)} severity="error">
                    Post must have an awesome Caption!
                </Alert>
            </Snackbar>
        </div>
    )
}
