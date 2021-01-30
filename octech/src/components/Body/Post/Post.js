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
import Box from '@material-ui/core/Box';
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


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const Post = forwardRef(({ id, name, description, message, photoUrl, largeGifs, comments, channelBy, hasCoordinates, lat, lng, viewingUser, star, totalStar, isPrivate }, ref) => {

  // const displayPosts = () => {
  //   console.log("hello", name);
  //   db.collection("posts").where("name", "==", name).get()
  //     .then(function (querySnapshot) {
  //       var postArray = [];
  //       querySnapshot.forEach(function (doc) {
  //         // doc.data() is never undefined for query doc snapshots
  //         console.log(doc.id, " => ", doc.data());
  //         postArray.push(doc.id);
  //       });
  //       console.log(postArray);
  //     })
  //     .catch(function (error) {
  //       console.log("Error getting documents: ", error);
  //     })
  // }




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
    db.collection("postImages").where("ref", "==", id).onSnapshot((snapshot) => {
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
    db.collection("users").doc(user.displayName).onSnapshot((doc) => {
      // console.log(snapshot);
      setCollections(doc.data().collections);
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
        }) // The post is removed from the users array of posts
      })
      setComment("");
    }

  }

  const addToCollection = (event) => {
    setAddToChannelAnchorEl(event.currentTarget);
  }

  const addImagesToCollection = (a) => {

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

  };


  var slideshow;
  if (images.length === 1) {
    slideshow = <div className="post__image"><img src={images[0].src} style={images[0].style} alt="User Post" /></div>;
  } else if (images.length > 1) {
    slideshow = <div ><ImageGallery sliderImages={images} /></div>;
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
          <h3>Comments</h3>
        </Modal.Header>
        <Modal.Body>
          {/* <Form style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} onSubmit={(e) => { e.preventDefault(); postComment() }}>
            <Form.Group className="w-100">
              <Form.Control type="text" placeholder="Comment..." value={comment} onChange={(e) => setComment(e.target.value)} required style={{ marginLeft: "auto", marginRight: "auto" }} />
            </Form.Group>
            <Form.Group>
              <SendIcon style={{ fontSize: "45px" }} onClick={postComment} />
            </Form.Group>
          </Form> */}
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

  return (
    <div ref={ref} className="post" >
      {collections &&
       <>
        { (channelBy?.length > 0) ? <div className="post_channel">
          <p className="h4">Posted in <b><Link to={`/user/${channelBy + "/channel/" + name}`}>{name}</Link></b></p>
          <hr />
        </div>
          : ''}
        <div className="post_title">
          <div className="post_header">
            <Avatar src={photoUrl}></Avatar> {/* Material ui component for avatar */}
            <div className="postInfo">
              <Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${channelBy ? channelBy : name}`}>{channelBy ? channelBy : name}</Link>  {/* Link is a component from react router that redirects to a particular route on click */}
              {/* This dynamically creates a new page with /user/{username} and sends the user to that page */}
              <p>{description}</p>
              <p>{isPrivate ? "Private" : "Public"}Post</p>
            </div>
          </div>
          {
            ((user.displayName === channelBy) || (user.displayName === name)) &&
            // <p onClick={deletePost} className="post__delete">Delete</p>
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
              // PaperProps={{
              //   style: {
              //     maxHeight: ITEM_HEIGHT * 4.5,
              //     width: '20ch',
              //   },
              // }}
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
        <div className="post_body" onClick={() => setShow(true)}>
          <p>{message}</p>
        </div>
        {slideshow}
        <br />
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <CommentIcon onClick={() => { setShowComments(true) }} />
          {hasCoordinates && <MapIcon onClick={() => { setShowMap(true) }} />}
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
              <Avatar src={photoUrl}></Avatar> {/* Material ui component for avatar */}
              <div className="postInfo">
                <Link style={{ textDecoration: 'none', fontSize: '20px', color: "black" }} to={`/user/${name}`}>{name}</Link>  {/* Link is a component from react router that redirects to a particular route on click */}
                {/* This dynamically creates a new page with /user/{username} and sends the user to that page */}
                <p>{description}</p>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="post_body">
              <p>{message}</p>
              <br />
            </div>
            {slideshow}
            <h3>Comments</h3>
            {/* <Form style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} onSubmit={(e) => { e.preventDefault(); postComment() }}>
            <Form.Group className="w-100">
              <Form.Control type="text" placeholder="Comment..." value={comment} onChange={(e) => setComment(e.target.value)} required style={{ marginLeft: "auto", marginRight: "auto" }} />
            </Form.Group>
            <Form.Group>
              <SendIcon style={{ fontSize: "45px" }} onClick={postComment} />
            </Form.Group>
          </Form> */}
            <TextField
              variant="outlined"
              margin="normal"
              multiline
              rowsMax={4}
              // fullWidth
              name="commentBox"
              label="Comment"
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
        <div className="rate">
          {showStars ?
            <Box>
              Rate
          <span style={{ float: "right" }}>Total Rating</span>
              <br />
              <StyledRating
                max={3}
                value={stars}
                onChange={updateStars}
                icon={<GradeIcon fontSize="inherit" />}
              />
              <span style={{ float: "right" }}>{totalStars}</span>
            </Box> :
            <Box>
              Total Rating : {totalStars}
              <br />
            </Box>}
        </div>
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
      </>}
    </div>
  );
});

export default Post;
