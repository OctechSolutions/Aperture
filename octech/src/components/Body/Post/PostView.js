import { Avatar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './Post.css';
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import firebase from "firebase";
import { auth } from '../../../firebase';
import { Link } from "react-router-dom";
import ImageGallery from '../Feed/ImageGallery';
import Modal from 'react-bootstrap/Modal';
import SendIcon from '@material-ui/icons/Send';
import MapIcon from '@material-ui/icons/Map';
import Map from '../Map/Map';
import Rating from '@material-ui/lab/Rating';
import GradeIcon from '@material-ui/icons/Grade';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import LockIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/Public';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import ReportIcon from '@material-ui/icons/Report';
import CountUp from 'react-countup';
import ForumIcon from '@material-ui/icons/Forum';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Chip from '@material-ui/core/Chip'
import AddAlarmRoundedIcon from '@material-ui/icons/AddAlarmRounded'
import Skeleton from '@material-ui/lab/Skeleton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import 'react-medium-image-zoom/dist/styles.css'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
    root: {
        "&:hover": {
            backgroundColor: "transparent"
        }
    }
});


const Post = ({ match }) => {


    const [id, setID] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [comments, setComments] = useState([]);
    const [channelBy, setChannelBy] = useState("");
    const [hasCoordinates, setHasCoordinates] = useState(false);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [star, setStar] = useState(0);
    const [totalStar, setTotalStar] = useState(0);
    const [timestamp, setTimestamp] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [locationPosts,] = useState([])
    const viewingUser = useSelector(selectUser);


    useEffect(() => {
        db.collection("posts").doc(match.params.id) // We get the user from the db whose id matches the name of the current user
            .get().then(doc => {
                // console.log(doc.data())
                setID(doc.id)
                setName(doc.data().name)
                setMessage(doc.data().message)
                setPhotoUrl(doc.data().photoUrl)
                if (doc.data().comments !== undefined)
                    setComments(doc.data().comments)
                setChannelBy(doc.data().channelBy)
                setHasCoordinates(doc.data().hasCoordinates)
                setLat(doc.data().lat)
                setLng(doc.data().lng)
                setStar(doc.data().stars)
                setTotalStar(doc.data.totalStars)
                setTimestamp(doc.data().timestamp)
                setIsPrivate(doc.data().isPrivate)
                setTotalStars(doc.data().totalStars)
                setShowStars(((doc.data().name === viewingUser.displayName) || (doc.data().channelBy === viewingUser.displayName)) ? false : true)
                setStars((doc.data().stars[viewingUser.uid] === undefined) ? 0 : doc.data().stars[viewingUser.uid])
                db.collection("postImages").where("ref", "==", doc.id).get().then((snapshot) => {
                    const tempImages = [];
                    const tempRefs = [];
                    snapshot.forEach((doc) => {
                        tempImages.push({
                            src: doc.data().url,
                            style: doc.data().styleModification,
                            overlayGifs: doc.data().overlayGifs,
                            overlayCoordinates: doc.data().overlayCoordinates,
                            orignalDimensions: doc.data().orignalDimensions,
                            tags: doc.data().tags
                        });
                        tempRefs.push(doc.id);
                        // console.log(doc.data(), doc.id)
                    });
                    setTimeout(() => { setLoading(false); }, 500)
                    setImages(tempImages);
                    setRefs(tempRefs);
                    if (tempImages[0] !== undefined)
                        setTags(tempImages[0].tags)
                    db.collection("posts").doc(doc.id).onSnapshot((doc) => {
                        if (doc.data() && doc.data().comments !== undefined)
                            setComments(doc.data().comments.reverse());
                    })
                });
            })
    }, [match.params.id, viewingUser])


    const [images, setImages] = useState([]);
    const [refs, setRefs] = useState([]);
    const [showTags, setShowTags] = useState(false);
    const [tags, setTags] = useState([]);
    const [showStars, setShowStars] = useState(((name === viewingUser.displayName) || (channelBy === viewingUser.displayName)) ? false : true);
    const [showMap, setShowMap] = useState(false);
    const [comment, setComment] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [addToChannelAnchorEl, setAddToChannelAnchorEl] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("");
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const open = Boolean(anchorEl);
    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };



    const StyledRating = withStyles({
    })(Rating);


    //Total Stars of the post
    const [totalStars, setTotalStars] = useState(totalStar);
    const [update, setUpdate] = useState(0);
    //Stars given by the user on the post
    const [stars, setStars] = useState();

    const history = useHistory();

    //TO update the stars after the user has given the stars
    const updateStars = async (e) => {
        let givenStars = parseInt(e.target.value);
        if (givenStars === stars)
            givenStars = 0;
        let newTotalStars = totalStars + (givenStars - stars);
        const post = db.collection("posts").doc(id);
        star[viewingUser.uid] = givenStars;


        if (givenStars > 0) {
            db.collection("users").doc(channelBy ? channelBy : name).collection("notifications").doc(channelBy ? channelBy : name).set({
                notifications: firebase.firestore.FieldValue.arrayUnion({
                    type: "rating",
                    sentAt: firebase.firestore.Timestamp.now(),
                    sender: viewingUser.displayName,
                    icon: viewingUser.photoUrl,
                    stars: givenStars,
                    postTitle: message,
                    postId: id
                })
            }, { merge: true })
        }

        post.update({ totalStars: newTotalStars, stars: star });

        const user = db.collection("users").doc((channelBy !== "") ? channelBy : name);
        db.runTransaction(transaction => (
            transaction.get(user).then(doc => {
                let profilePoints = doc.data().profilePoints;
                let newProfilePoints = profilePoints + (givenStars - stars);
                let league = doc.data().league;
                let leaguee = "";

                if (league !== "Champion" && league !== "Legendary") {
                    if (newProfilePoints < 100)
                        leaguee = "No league profile points less than 100"
                    else if (newProfilePoints < 500)
                        leaguee = "Silver"
                    else if (newProfilePoints < 1000)
                        leaguee = "Gold"
                    else if (newProfilePoints < 1200)
                        leaguee = "Diamond"
                    else
                        leaguee = "Platinum"
                }

                if (league && (league === leaguee || leaguee === ""))
                    transaction.update(user, { profilePoints: newProfilePoints });
                else {
                    transaction.update(user, {
                        profilePoints: newProfilePoints, league: leaguee, notifyLeague: true, leagueStatus: profilePoints > newProfilePoints ? "d" : "p"
                    });
                }
            })));
        setStars(givenStars);
        setTotalStars(newTotalStars);
    }

    useEffect(() => {
        db.collection("users").doc(user.displayName).get().then((doc) => {
            setCollections(doc.data().collections);
            if (timestamp) {
                moment(timestamp.toDate()).fromNow();
            }
        })
    }, []);

    const postComment = () => {
        console.log(comment, id);
        if (comment.replace(/\s/g, '').length) {
            db.collection("posts").doc(id).update({
                comments: firebase.firestore.FieldValue.arrayUnion({
                    name: user.displayName,
                    comment: comment,
                    number: comments.length
                })
            })
            if (name !== user.displayName) {
                if (channelBy) {
                    db.collection("users").doc(channelBy).collection("notifications").doc(channelBy).set({
                        notifications: firebase.firestore.FieldValue.arrayUnion({
                            type: "comment",
                            sentAt: firebase.firestore.Timestamp.now(),
                            sender: user.displayName,
                            icon: user.photoUrl,
                            comment: comment,
                            postTitle: message,
                            postId: id
                        })
                    }, { merge: true })
                }
                else {
                    db.collection("users").doc(name).collection("notifications").doc(name).set({
                        notifications: firebase.firestore.FieldValue.arrayUnion({
                            type: "comment",
                            sentAt: firebase.firestore.Timestamp.now(),
                            sender: user.displayName,
                            icon: user.photoUrl,
                            comment: comment,
                            postTitle: message,
                            postId: id
                        })
                    }, { merge: true })
                }
            }

            setUpdate(update + 1);
            setComment("");
        }

    }

    const addToCollection = (event) => {
        setAddToChannelAnchorEl(event.currentTarget);
    }

    const addImagesToCollection = (a) => {
        console.log(a);
        db.collection("collections").doc(user.displayName + a).update({
            imageRef: firebase.firestore.FieldValue.arrayUnion(...refs)
        });
        setAddToChannelAnchorEl(null);
        setAnchorEl(null);
        setSnackbarOpen(true);
        setSnackbarMessage(`Added image/s to the collection ${a}!`);
        setSnackbarType("success");
    }

    const user = useSelector(selectUser); // Select current user from slice
    const deletePost = () => { // This function is called when the delete button is clicked

        db.collection("users").doc(user.displayName).update({
            posts: firebase.firestore.FieldValue.arrayRemove(id) // The post is removed from the users array of posts
        })

        console.log(refs)
        refs.forEach((ids) => {
            console.log(ids);
            db.collection('postImages').doc(ids).delete();
            console.log("Post image deleted!")
        });


        db.collection("posts") // The post is removed from the posts database
            .doc(id)
            .delete()
            .then(function () {
                console.log("deleted post successfully!");
                console.log(id);
            })
            .catch(function (error) {
                console.log(`Error post info delete ${error}`);
            });

        history.push("/")
    };

    var slideshow;
    if (images.length >= 1)

        slideshow = <ImageGallery sliderImages={images} />
    else {
        slideshow = <></>
    }


    const addToPortfolio = () => {

        db.collection("portfolios").doc(user.displayName).get().then((doc) => {
            if (doc.data() === undefined) {
                setSnackbarOpen(true);
                setSnackbarMessage("Create a Portfolio First!");
                setSnackbarType("error");
            }
            else {
                db.collection("portfolios").doc(user.displayName).update({
                    imageRef: firebase.firestore.FieldValue.arrayUnion(...refs)
                });
                setSnackbarOpen(true);
                setSnackbarMessage("Added image/s to portfolio!");
                setSnackbarType("success");
            }
        })

    }

    // Related to CHALLENGES --------------------------------------------------------------------------------------
    const [challengeNameForm, setChallengeNameForm] = useState(false)
    const [challengeName, setChallengeName] = useState("")
    const [challengeChip, setChallengeChip] = useState(null)
    const [challengeCodeTextField, setChallengeNameTextField] = useState(null) // TextField where the CHALLENGE code is to be entered.

    // Function that opens the input form to enter a CHALLENGE code.
    const handleChallengeNameFormOpen = () => {
        setChallengeNameForm(true);
    }

    // Function that closes the input form to enter a CHALLENGE code.
    const handleChallengeNameFormClose = () => {
        setChallengeNameForm(false);
    }

    // Function that pulls a post out of a challenge.
    const removeChallenge = (challengeName) => {
        if (user.displayName === name) { // If the user is the admin user, then allow to withdraw from challenge.
            // Remove this challenge from the challenges list of this post.
            db.collection("posts").doc(id).update({ challenge: firebase.firestore.FieldValue.delete() })
                .then(() => {
                    updateChallengeChip() // Display updated chllenges.
                })
            // Remove corresponding challenge post from the challengePosts collection.
            db.collection("challengePosts").doc(id).delete()
                .then(() => {
                    updateChallengeChip() // Display updated chllenges.
                })
        }
    }

    // Function that allows a post to participate in a CHALLENGE.
    const handleChallengeCodeFormSubmit = () => {

        if (challengeCodeTextField) { // Proceed only if the challenge code text field is not null.

            // Check if the code entered is an existing challenge.
            db.collection("challenges").doc(challengeCodeTextField.value).get()
                .then((challengeDoc) => {
                    if (!challengeDoc.data()) { // If entered code is invalid then let user know.
                        challengeCodeTextField.value = "Please Enter Valid Challenge Title."
                    } else { // If entered code is valid then ...
                        if (challengeDoc.data().hasEnded) {
                            challengeCodeTextField.value = "Sorry, this challenge has ended."
                        }
                        else {
                            setChallengeName(challengeCodeTextField.value) // Set the challenge code to be the textbox value.
                            db.collection("posts").doc(id) // Add this challenge to the post's challenges array field.
                                .update({ challenge: challengeName })
                                .then(() => {
                                    console.log("Added Challenge = " + challengeName)
                                    updateChallengeChip() // Update the challenge chips that are displayed on the post.
                                    handleChallengeNameFormClose()
                                })
                            if (hasCoordinates) {
                                db.collection("challengePosts").doc(id).set({ // This adds a new duplicate challenge post.
                                    key: id,
                                    caption: message || "My Awesome Post",
                                    imageSrc: images[0].src,
                                    style: images[0].style,
                                    creator: channelBy ? channelBy : name,
                                    creatorPhotoUrl: photoUrl || "",
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                    challengePoints: 0,
                                    challenge: challengeName,
                                    ref: id,
                                    stars: {},
                                    hasEnded: false,
                                    hasCoordinates: hasCoordinates,
                                    lat: lat,
                                    lng: lng
                                })
                            } else {
                                db.collection("challengePosts").doc(id).set({ // This adds a new duplicate challenge post.
                                    key: id,
                                    caption: message || "My Awesome Post",
                                    imageSrc: images[0].src,
                                    style: images[0].style,
                                    creator: channelBy ? channelBy : name,
                                    creatorPhotoUrl: photoUrl || "",
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                    challengePoints: 0,
                                    challenge: challengeName,
                                    ref: id,
                                    stars: {},
                                    hasEnded: false,
                                    hasCoordinates: hasCoordinates
                                })
                            }
                        }
                    }
                })
        }
    }

    // Function that populates the challengeChip and challengeNames array the 1st time.
    const updateChallengeChip = () => {
        setChallengeChip(null)
        // Fetch challenge titles of this post.
        db.collection("posts").doc(id).get()
            .then((postDoc) => {
                if (postDoc.data()) {
                    let postChallenge = postDoc.data().challenge
                    if (postChallenge) { // If this post has a challenge then ...
                        setChallengeChip(postChallenge)
                        setChallengeChip(<Chip label={postChallenge} onDelete={() => removeChallenge(challengeName)} />)
                    }
                }
            })
    }

    // Function to handle the report button being clicked
    const handleReportClick = (post_id) => {
        let c = window.confirm("Are you sure you want to report this post?");
        if (c === true) {
            console.log(user.email);
            db.collection("postReports")
                .add({
                    postID: post_id,
                    reportedBy: user.email
                })
                .then(() => {
                    alert("You have reported this post successfully.");
                })
                .catch(err => {
                    console.log(err);
                    alert("An error has occurred reporting this post.");
                })
        }
    }

    // ------------------------------------------------------------------------------------------------------------

    //Add tags 
    const addTag = (e) => {
        const currentUser = auth.currentUser
        db.collection("posts").doc(id).get().then(doc => {
            db.collection("users").doc(currentUser.displayName).get().then(user => {
                if (user.id !== doc.data().name) return alert("you can't change this user's tag");
                if (e.key === "Enter" && e.target.value !== "") {
                    if (e.target.value.length > 0) {
                        const newTags = tags === undefined || tags === [] || tags.length < 0 ? [] : [...tags];
                        newTags.push(e.target.value.toLowerCase());
                        setTags(newTags);

                        db.collection("postImages").where("ref", "==", id).get().then(doc => db.collection("postImages").doc(doc.docs[0].id).update({
                            tags: newTags,
                        }));

                        e.target.value = "";
                    }
                }
            })
        })


    };

    //Remove tags
    const removeTag = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
        db.collection("postImages").where("ref", "==", id).get().then(doc => db.collection("postImages").doc(doc.docs[0].id).update({
            tags: newTags
        }))
    };
    return (
        <>
            <div className="post" style={{ width: "95%", marginBottom: "60px" }} key={id}>
                <IconButton onClick={() => { history.goBack() }}>
                    <ArrowBackIcon />
                </IconButton>
                <Modal
                    show={showMap}
                    onHide={() => { setShowMap(false) }}
                    keyboard={false}
                    size="xl"
                    centered
                >
                    <Modal.Header closeButton onClick={() => { setShowMap(false) }}><h3 style={{ marginLeft: "auto" }}>Map View</h3></Modal.Header>
                    <Modal.Body>
                        <div>
                            <Map
                                center={{ lat: lat, lng: lng }}
                                images={images}
                                message={message}
                                photoUrl={photoUrl}
                                locationPosts={locationPosts}
                                id={id}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
                {!loading ? <div>
                    {(channelBy?.length > 0) ? <div className="post_channel">
                        <p className="h4">Posted in <b><Link to={`/user/${channelBy + "/channel/" + name}`}>{name}</Link></b></p>
                        <hr />
                    </div>
                        : ''}
                    <div className="post_title">
                        <div className="post_header">
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={() => { history.push(`/user/${channelBy ? channelBy : name}`) }}
                            >
                                <Avatar src={photoUrl}></Avatar> {/* Material ui component for avatar */}
                            </IconButton>
                            <div className="postInfo">
                                <div style={{ marginLeft: "-12px" }}>
                                    <Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${channelBy ? channelBy : name}`}>

                                        {channelBy ? channelBy : name}</Link>
                                    <>
                                        {
                                            ((channelBy?.length === 0)) ?
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={() => {
                                                        if (name === user.displayName)
                                                            db.collection("posts").doc(id).update({ isPrivate: !isPrivate })
                                                    }}
                                                >
                                                    {isPrivate ? <LockIcon fontSize="small" /> : <PublicIcon fontSize="small" />}
                                                </IconButton>
                                                :
                                                <>
                                                    {
                                                        (channelBy?.length > 0) ?
                                                            <IconButton
                                                                aria-label="more"
                                                                aria-controls="long-menu"
                                                                aria-haspopup="true"
                                                            >
                                                                <PhotoLibraryIcon />
                                                            </IconButton>
                                                            :
                                                            <IconButton
                                                                aria-label="more"
                                                                aria-controls="long-menu"
                                                                aria-haspopup="true"
                                                            >
                                                                <ForumIcon />
                                                            </IconButton>}
                                                </>
                                        }
                                        {hasCoordinates &&
                                            <IconButton
                                                aria-label="map"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={() => {

                                                    setShowMap(true)

                                                }}
                                            >
                                                <MapIcon />
                                            </IconButton>
                                        }
                                        {timestamp ? <div style={{ fontSize: "13px", color: "gray", marginTop: "-12px" }}>{moment(timestamp.toDate()).fromNow()}</div> : <div style={{ fontSize: "13px", color: "gray", marginTop: "-10px" }}>
                                            a few seconds ago
                      </div>}
                                    </>  {/* Link is a component from react router that redirects to a particular route on click */}
                                    {/* This dynamically creates a new page with /user/{username} and sends the user to that page */}

                                </div>


                            </div>

                        </div>

                        { // 3 DOTS MENU.
                            ((user.displayName === channelBy) || (user.displayName === name)) ?
                                <>
                                    <IconButton
                                        aria-label="more"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={open}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem key={"delete"} selected={false} onClick={() => { console.log("Delete clicked"); deletePost(); handleMenuClose() }}>
                                            <ListItemIcon>
                                                <DeleteIcon />
                                            </ListItemIcon>
                  Delete
                </MenuItem>
                                        {(images.length > 0) &&
                                            <MenuItem key={"addToPortfolio"} selected={false} onClick={() => { console.log("Add clicked"); handleMenuClose(); addToPortfolio() }}>
                                                <ListItemIcon>
                                                    <AddToPhotosIcon />
                                                </ListItemIcon>
                    Add To Portfolio
                  </MenuItem>
                                        }
                                        {(images.length > 0) && (collections.length > 0) &&
                                            <MenuItem key={"addToCollections"} selected={false} onClick={addToCollection}>
                                                <ListItemIcon>
                                                    <AddPhotoAlternateIcon />
                                                </ListItemIcon>
                    Add To Collections
                  </MenuItem>
                                        }

                                        {/* To enter a challenge. */}
                                        {
                                            (images.length === 1) && !challengeChip &&
                                            <MenuItem key={"enterChallenge"} selected={false} onClick={() => { console.log("Enter Challenge clicked"); handleChallengeNameFormOpen(); handleMenuClose() }}>
                                                <ListItemIcon>
                                                    <AddAlarmRoundedIcon />
                                                </ListItemIcon>
                    Enter Challenge
                  </MenuItem>
                                        }

                                    </Menu>
                                    <Menu
                                        anchorEl={addToChannelAnchorEl}
                                        keepMounted
                                        open={Boolean(addToChannelAnchorEl) && collections}
                                        onClose={() => { setAddToChannelAnchorEl(null); }}
                                    >
                                        {
                                            collections.map((a) => {
                                                return <MenuItem onClick={() => { addImagesToCollection(a); }}>{a}</MenuItem>
                                            })
                                        }
                                    </Menu>
                                </>
                                :
                                <IconButton onClick={() => { handleReportClick(id) }}>
                                    <ReportIcon />
                                </IconButton>
                        }
                    </div>
                    <div className="post_body">
                        <p>{message}</p>
                    </div>
                    {!loading && <div>{slideshow}</div>}
                    <div >

                        <center>

                            <>
                                {showStars ?
                                    <IconButton
                                        aria-label="stars"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        className={classes.root}
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                    >

                                        <StyledRating
                                            max={3}
                                            value={stars}
                                            onChange={updateStars}
                                            icon={<GradeIcon fontSize="inherit" />}
                                        />
                  &nbsp;
                  <CountUp end={totalStars} style={{ marginTop: "-8px" }} />
                                    </IconButton>
                                    :
                                    <IconButton
                                        aria-label="rating"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        className={classes.root}
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                    >
                                        Rating : &nbsp;<CountUp end={totalStars} style={{ marginTop: "5px" }} />
                                    </IconButton>
                                }
                            </>

                            {/* Form to input Challenge Code. */}
                            <Dialog open={challengeNameForm} onClose={handleChallengeNameFormClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Enter Challenge Title</DialogTitle>
                                <DialogContentText style={{ padding: "3%" }}>
                                    To participate in a challenge, please enter a challenge title.
              </DialogContentText>
                                <DialogContent>
                                    {/* Challenge Code */}
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Challenge Title"
                                        type="text"
                                        fullWidth
                                        required
                                        onChange={(event) => {
                                            setChallengeNameTextField(event.target);
                                            setChallengeName(event.target.value);
                                        }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleChallengeNameFormClose} color="primary"> Cancel </Button>
                                    <Button onClick={handleChallengeCodeFormSubmit} color="primary"> Add </Button>
                                </DialogActions>
                            </Dialog>
                        </center>
                        <center>
                            <h3>Comments</h3>
                        </center>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            multiline
                            rowsMax={4}
                            fullWidth
                            value={comment}
                            name="commentBox"
                            label="Comment"
                            id="commentBox"
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.preventDefault();
                                    postComment();
                                }
                            }}
                            InputProps=
                            {{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="comment"
                                            onClick={postComment}
                                            edge="end"
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>

                            }}
                            onChange={(e) => setComment(e.target.value)}

                        />
                        <br />
                        {comments &&
                            comments.map((c) => {
                                return <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ padding: "10px" }}>
                                        <Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${c.name}`}>
                                            <b>{c.name}</b>
                                        </Link>   {c.comment}
                                    </div>
                                    {c.name === user.displayName && <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => {
                                            if (comments !== undefined) {
                                                db.collection("posts").doc(id).update({
                                                    comments: firebase.firestore.FieldValue.arrayRemove(c)
                                                })

                                            }
                                        }}
                                        edge="end"
                                    >
                                        <DeleteIcon />
                                    </IconButton>}
                                </div>
                            })

                        }
                    </div>

                    {/*Tags Modal*/}
                    <Modal
                        show={showTags}
                        onHide={() => { setShowTags(false) }}
                        keyboard={false}
                        size="l"
                        aria-labelledby="contained-modal-title-vcenter"
                        scrollable={true}
                        centered
                    >
                        <Modal.Header closeButton onClick={() => { setShowTags(false) }}>
                            <Modal.Title> Tags </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <TextField className="tag-container" label="Add tags" margin="normal" variant="outlined"
                                onKeyUp={addTag} />
                            <br />
                            {tags && tags.map(m =>
                                <Chip
                                    className={classes.root}
                                    label={m}
                                    color="primary"
                                    onDelete={() => removeTag(m)}
                                />)}
                        </Modal.Body>
                    </Modal>

                    <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => { setSnackbarOpen(false) }}>
                        <Alert onClose={() => { setSnackbarOpen(false) }} severity={snackbarType}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>

                    {challengeChip} {/* Display all challenges that this post is participating in. */}

                </div> : <center><div style={{ width: "85vw" }}>
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                        <Skeleton variant="circle" width={"40px"} height={"40px"} animation="wave" />
                        <Skeleton variant="text" width={"80%"} height={"40px"} animation="wave" style={{ marginLeft: "20px" }} />
                    </div>
                    <center><Skeleton variant="text" className="post__imageWrapper" height={"20px"} animation="wave" style={{ marginBottom: "20px" }} /></center>
                    <center><Skeleton variant="rect" className="post__imageWrapper" height={"30vh"} animation="wave" style={{ borderRadius: "40px", marginBottom: "20px" }} /></center>
                    <center><Skeleton variant="text" className="post__imageWrapper" height={"50px"} animation="wave" /></center>
                </div>
                </center>
                }
            </div>
            <br />
        </>
    );
};

export default Post;
