import { Avatar } from '@material-ui/core';
import React, { forwardRef, useState, useEffect } from 'react';
import './Post.css';
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import firebase from "firebase";
import { Link } from "react-router-dom";
import ImageGallery from '../Feed/ImageGallery';
import Modal from 'react-bootstrap/Modal';
import CommentIcon from '@material-ui/icons/Comment';
import SendIcon from '@material-ui/icons/Send';
import MapIcon from '@material-ui/icons/Map';
import Map from '../Map/Map';
import Rating from '@material-ui/lab/Rating';
// import FavoriteIcon from '@material-ui/icons/Favorite';
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
import FullscreenIcon from '@material-ui/icons/Fullscreen';
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


const Post = forwardRef(({ id, name, description, message, photoUrl, largeGifs, comments, channelBy, hasCoordinates, lat, lng, viewingUser, star, totalStar, isPrivate, timestamp, type, isForumPost, challenges, isChallengeView }, ref) => {

  if (comments === undefined) {
    comments = [];
  }


  const [images, setImages] = useState([]);
  const [refs, setRefs] = useState([]);
  const [show, setShow] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showStars,] = useState(((name === viewingUser.displayName) || (channelBy === viewingUser.displayName)) ? false : true);
  const [showMap, setShowMap] = useState(false);
  const [comment, setComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [addToChannelAnchorEl, setAddToChannelAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [collections, setCollections] = useState([]);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const StyledRating = withStyles({
    // iconFilled: {
    //   color: '#ff6d75',
    // },
    // iconHover: {
    //   color: '#ff3d47',
    // },
  })(Rating);


  //Total Stars of the post
  const [totalStars, setTotalStars] = useState(totalStar);
  //Stars given by the user on the post
  const [stars, setStars] = useState((star[viewingUser.uid] === undefined) ? 0 : star[viewingUser.uid]);
  const history = useHistory();
  //TO update the stars after the user has given the stars
  const updateStars = (e) => {
    let givenStars = parseInt(e.target.value);
    if (givenStars === stars)
      givenStars = 0;
    let newTotalStars = totalStars + (givenStars - stars);
    const post = db.collection("posts").doc(id);
    star[viewingUser.uid] = givenStars;
    post.update({ totalStars: newTotalStars, stars: star });

    const user = db.collection("users").doc((channelBy !== "") ? channelBy : name);
    db.runTransaction(transaction => (
      transaction.get(user).then(doc => {
        let profilePoints = doc.data().profilePoints;
        let newProfilePoints = profilePoints + (givenStars - stars);
        transaction.update(user, { profilePoints: newProfilePoints });
      })));
    setStars(givenStars);
    setTotalStars(newTotalStars);
  }

  const handleClose = () => setShow(false);
  useEffect(() => {
    db.collection("postImages").where("ref", "==", id).get().then((snapshot) => {
      const tempImages = [];
      const tempRefs = [];
      snapshot.forEach((doc) => {
        tempImages.push({
          src: doc.data().url,
          style: doc.data().styleModification
        });
        tempRefs.push(doc.id);
        // console.log(doc.data(), doc.id)
      });
      setImages(tempImages);
      setRefs(tempRefs);
    });
  }, [id]);

  useEffect(() => {
    db.collection("users").doc(user.displayName).get().then((doc) => {
      // console.log(snapshot);
      setCollections(doc.data().collections);
      if (timestamp) {
        moment(timestamp.toDate()).fromNow();
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postComment = () => {
    console.log(comment, id);
    if (comment.replace(/\s/g, '').length) {
      if (isForumPost) {
        db.collection("forumPosts").doc(id).update({
          comments: firebase.firestore.FieldValue.arrayUnion({
            name: user.displayName,
            comment: comment,
            number: comments.length
          })
        })
      }
      else {
        db.collection("posts").doc(id).update({
          comments: firebase.firestore.FieldValue.arrayUnion({
            name: user.displayName,
            comment: comment,
            number: comments.length
          })
        })
      }

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

    if (largeGifs) {
      largeGifs.forEach((name) => {
        const storageRef = storage.ref()
        var ref = storageRef.child(name);

        // Delete the file
        ref.delete().then(function () {
          // File deleted successfully
          console.log(name, " deleted from storage!")
        })
      })
    }



    if (isForumPost) {
      db.collection("forumPosts") // The post is removed from the posts database
        .doc(id)
        .delete()
        .then(function () {
          console.log("deleted post successfully!");
          console.log(id);
        })
        .catch(function (error) {
          console.log(`Error post info delete ${error}`);
        });
    }
    else {
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
    }


  };


  var slideshow;
  if (images.length === 1) {
    slideshow = <div className="post__image"><img src={images[0].src} style={images[0].style} alt="User Post" /></div>;
  } else if (images.length > 1) {
    slideshow = <div><ImageGallery sliderImages={images} /></div>;
  }
  else {
    slideshow = <></>
  }

  const commentsModal = () => {
    return (
      <Modal
        show={showComments}
        keyboard={false}
        onHide={() => { setShowComments(false) }}
        size="l"
        aria-labelledby="contained-modal-title-vcenter"
        scrollable={true}
        centered
      >
        <Modal.Header closeButton onClick={() => { setShowComments(false) }}>
          {isForumPost ? <h3>Feedback</h3> : <h3>Comments</h3>}
        </Modal.Header>
        <Modal.Body>
          <TextField
            variant="outlined"
            margin="normal"
            multiline
            rowsMax={4}
            fullWidth
            value={comment}
            name="commentBox"
            label={isForumPost ? "Feedback" : "Comment"}
            id="commentBox"
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                // Do code here
                ev.preventDefault();
                postComment();
              }
            }}
            InputProps=
            {{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={postComment}
                    onMouseDown={() => { }}
                    edge="end"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>

            }}
            onChange={(e) => setComment(e.target.value)}

          />
          <br />
          {
            comments.sort((a, b) => b.number - a.number).map((c) => {
              return <div><Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${c.name}`}><b>{c.name}</b></Link>   {c.comment}</div>
            })

          }
        </Modal.Body>
      </Modal>
    )
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
  const [challengeChips, setChallengeChips] = useState([])  
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
      db.collection("posts").doc(id).update({challenges: firebase.firestore.FieldValue.arrayRemove(challengeName)})
      .then(() => {
        console.log("Challenge removed = " + challengeName)
        updateChallengeChips() // Display updated chllenges.
      })
    }
  }

  // Function that allows a post to participate in a CHALLENGE.
  const handleChallengeCodeFormSubmit = () => {

    if(challengeCodeTextField) { // Proceed only if the challenge code text field is not null.

      // Check if the code entered is an existing challenge.
      db.collection("challenges").doc(challengeCodeTextField.value).get()
      .then((challengeDoc) => {
        if(!challengeDoc.data()) { // If entered code is invalid then let user know.
          challengeCodeTextField.value = "Please Enter Valid Challenge Title."
        } else { // If entered code is valid then ...
          setChallengeName(challengeCodeTextField.value) // Set the challenge code to be the textbox value.
          db.collection("posts").doc(id) // Add this challenge to the post's challenges array field.
          .update({challenges : firebase.firestore.FieldValue.arrayUnion(challengeName)})
          .then(() => { 
              console.log("Added Challenge = " + challengeName)
              updateChallengeChips() // Update the challenge chips that are displayed on the post.
              handleChallengeNameFormClose() 
          })
        }
      })
    }
  }

  // Function that populates the challengeChips and challengeNames array the 1st time.
  const updateChallengeChips = () => {
    setChallengeChips([]) // Clear existing challengeChips array.

    // Fetch challenge titles of this post.
    db.collection("posts").doc(id).get()
    .then((postDoc) => {
      if(postDoc.data()){
        let challengeArr = postDoc.data().challenges
        if(challengeArr) { // If this post has challenges then ...
          challengeArr.forEach((challengeName) => { 
            setChallengeChips((prev) => [...prev, <Chip label={challengeName} onDelete={() => removeChallenge(challengeName)}/>]) 
          })
        }
      }
    })
  }

  // Update Challenge Chips when component mounted.
  // eslint-disable-next-line
  useEffect(() => { updateChallengeChips() }, []);

  // ------------------------------------------------------------------------------------------------------------

  return (
    <div ref={ref} className="post" key={id}>
      <div>
        {(channelBy?.length > 0) ? <div className="post_channel">
          <p className="h4">Posted in <b><Link to={`/user/${channelBy + "/channel/" + name}`}>{name}</Link></b></p>
          <hr />
        </div>
          : ''}
        {(isForumPost) ? <div className="post_forum">
          <p className="h4">Posted in <b><Link to={`/forums/${type}`}>{(type === "feedbackForum") ? <>Feedback Forum</> : <>Gaming Forum</>}</Link></b></p>
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
              <div>
                <Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${channelBy ? channelBy : name}`}>

                  {channelBy ? channelBy : name}</Link>
                <>
                  {
                    (!isForumPost && (channelBy?.length === 0)) ?
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
                      onClick={() => { setShowMap(true) }}
                    >
                      <MapIcon />
                    </IconButton>
                  }
                  {timestamp ? <div style={{ fontSize: "13px", color: "gray", marginTop: "-10px" }}>{moment(timestamp.toDate()).fromNow()}</div> : <div style={{ fontSize: "13px", color: "gray", marginTop: "-10px" }}>
                    a few seconds ago
                      </div>}
                </>  {/* Link is a component from react router that redirects to a particular route on click */}
                {/* This dynamically creates a new page with /user/{username} and sends the user to that page */}

              </div>

              {/* <p>{isPrivate ? "Private" : "Public"}Post</p> */}

            </div>

          </div>
          <>
          </> 
          { // 3 DOTS MENU.
            ((user.displayName === channelBy) || (user.displayName === name)) &&
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
                {(images.length > 0) && !isForumPost &&
                  <MenuItem key={"addToPortfolio"} selected={false} onClick={() => { console.log("Add clicked"); handleMenuClose(); addToPortfolio() }}>
                    <ListItemIcon>
                      <AddToPhotosIcon />
                    </ListItemIcon>
                    Add To Portfolio
                  </MenuItem>
                }
                {(images.length > 0) && (collections.length > 0) && !isForumPost &&
                  <MenuItem key={"addToCollections"} selected={false} onClick={addToCollection}>
                    <ListItemIcon>
                      <AddPhotoAlternateIcon />
                    </ListItemIcon>
                    Add To Collections
                  </MenuItem>
                }
                
                {/* To enter a challenge. */}
                <MenuItem key={"enterChallenge"} selected={false} onClick={() => { console.log("Enter Challenge clicked"); handleChallengeNameFormOpen(); handleMenuClose() }}>
                  <ListItemIcon>
                    <AddAlarmRoundedIcon />
                  </ListItemIcon>
                  Enter Challenge
                </MenuItem>
                
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
          }
        </div>
        <div className="post_body">
          <br />
          <p>{message}</p>
        </div>
        {slideshow}
        <br />
        <div >

          <div className="rate" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            {
              !isForumPost ?
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
                      <CountUp end={totalStars} />
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
                      Rating : {totalStars}
                    </IconButton>}
                </>
                : <div></div>
            }

            {/* Form to input Challenge Code. */}
            <Dialog open={challengeNameForm} onClose={handleChallengeNameFormClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Enter Challenge Title</DialogTitle>
              <DialogContentText style={{padding: "3%"}}>
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

            <div>
              <IconButton
                aria-label="comments"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={() => { setShowComments(true) }}
              >
                <CommentIcon />
              </IconButton>
              <IconButton
                aria-label="comments"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={() => setShow(true)}
              >
                <FullscreenIcon />
              </IconButton>
            </div>
          </div>

        </div>
        {commentsModal()}
        <Modal
          show={show}
          onHide={handleClose}
          keyboard={false}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          scrollable={true}
          centered
        >
          <Modal.Header closeButton onClick={handleClose}>
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
                <div>
                  <Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${channelBy ? channelBy : name}`}>

                    {channelBy ? channelBy : name}</Link><>
                    {
                      (!isForumPost && (channelBy?.length === 0)) ?
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
                    {timestamp ? <div style={{ fontSize: "13px", color: "gray", marginTop: "-10px" }}>{moment(timestamp.toDate()).fromNow()}</div> : <div style={{ fontSize: "13px", color: "gray", marginTop: "-10px" }}>
                      a few seconds ago
                      </div>}
                  </>  {/* Link is a component from react router that redirects to a particular route on click */}
                  {/* This dynamically creates a new page with /user/{username} and sends the user to that page */}

                </div>

                {/* <p>{isPrivate ? "Private" : "Public"}Post</p> */}

              </div>

            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="post_body">
              <p>{message}</p>
            </div>
            {slideshow}
            <br />
            {isForumPost ? <h3>Feedback</h3> : <h3>Comments</h3>}
            <TextField
              variant="outlined"
              margin="normal"
              multiline
              rowsMax={4}
              // fullWidth
              name="commentBox"
              label={isForumPost ? "Feedback" : "Comment"}
              id="commentBox"
              value={comment}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  // Do code here
                  ev.preventDefault();
                  postComment();
                }
              }}
              InputProps=
              {{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="comment send"
                      onClick={postComment}
                      onMouseDown={() => { }}
                      edge="end"
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>

              }}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "80%", marginLeft: "10%" }}
            />
            <br />
            {
              comments.sort((a, b) => b.number - a.number).map((c) => {
                return <div><Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${c.name}`}><b>{c.name}</b></Link>   {c.comment}</div>
              })

            }
          </Modal.Body>
        </Modal>

        <Modal
          show={showMap}
          onHide={() => { setShowMap(false) }}
          keyboard={false}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={() => { setShowMap(false) }}><h3 style={{ marginLeft: "auto" }}>Map View</h3></Modal.Header>
          <Modal.Body>
            <Map
              center={{ lat: lat, lng: lng }}
              height='100vh'
              zoom={15}
              draggable={false}
            />
          </Modal.Body>
        </Modal>
        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => { setSnackbarOpen(false) }}>
          <Alert onClose={() => { setSnackbarOpen(false) }} severity={snackbarType}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        { challengeChips } {/* Display all challenges that this post is participating in. */}
        
      </div>

    </div>
  );
});

export default Post;
