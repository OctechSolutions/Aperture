import React, { useEffect, useState, useRef } from "react";
import "./Feed.css";
import { Avatar } from "@material-ui/core";
import Post from "../Post/Post";
import { db } from "../../../firebase";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import FlipMove from "react-flip-move";
import ImageIcon from "@material-ui/icons/Image";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import ImageGallery from "./ImageGallery";
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import DraggableMap from "../Map/DraggableMap";
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from "react-router-dom";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import InputBase from '@material-ui/core/InputBase';
import LockIcon from '@material-ui/icons/Lock';
import PublicIcon from '@material-ui/icons/Public';
import "cropperjs/dist/cropper.css";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { motion } from "framer-motion";
import CloseIcon from '@material-ui/icons/Close';
import ReactGiphySearchbox from "react-giphy-searchbox";
import FilerobotImageEditor from "filerobot-image-editor";
import TuneIcon from '@material-ui/icons/Tune';
import GifIcon from '@material-ui/icons/Gif';
import DoneIcon from '@material-ui/icons/Done';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField';
import { GiphyApiKey } from "./giphy-config"
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');

const Compress = require('compress.js');


const useStyles = makeStyles((theme) => ({
  root: {
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Feed({ match }, props) {
  const user = useSelector(selectUser);
  const history = useHistory();

  const [input, setInput] = useState("");
  const [profileInfo, setProfileInfo] = useState("");
  const [, setFile] = useState(null)
  const [inputImg, setInputImg] = useState("");
  const [posts, setPosts] = useState([]);
  const [cameraActive, setCameraActive] = useState("");
  const [sliderImages, setSliderImages] = useState([]);
  const [largeImages, setLargeImages] = useState([]);
  const [, setNohuman] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditMap, setShowEditMap] = useState(false);
  const [lat, setLat] = useState(25.1972);
  const [lng, setLng] = useState(55.2744);
  const [coordinatesSelected, setCoordinatesSelected] = useState(false);
  const [isPrivatePost, setIsPrivatePost] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showPostComponent, setShowPostComponent] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [tags, setTags] = useState([]);
  const [loaded, setLoaded] = useState(false);


  const [channelInfo, setChannelInfo] = useState("")

  const cocoSsd = require('@tensorflow-models/coco-ssd');

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [showGifSearch, setShowGifSearch] = useState(false)


  function getImageStyle() {
    return { filter: "" }
  }

  useEffect(() => {
    db.collection("users").doc(user.displayName).get().then(doc => {
      if (doc.data() && doc.data().notifyLeague) {
        //Sending Notification About league change
        if (doc.data().leagueStatus === "p") {
          db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
            notifications: firebase.firestore.FieldValue.arrayUnion({
              type: "leaguePromote",
              sentAt: firebase.firestore.Timestamp.now(),
              league: doc.data().league,
              message: `Yaayy! You have been promoted to `
            })
          }, { merge: true })
        }
        else if (doc.data().leagueStatus === "d") {
          db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
            notifications: firebase.firestore.FieldValue.arrayUnion({
              type: "leagueDemote",
              sentAt: firebase.firestore.Timestamp.now(),
              league: doc.data().league,
              message: `Oops! You have been demoted to `
            })
          }, { merge: true })
        }
        db.collection("users").doc(user.displayName).set({
          notifyLeague: false
        }, { merge: true })
      }
    })
  }, [user.displayName])

  useEffect(() => { // This useEffect is called on the component mounting, it fetches all the posts from the db and stores them into the posts array
    db.collection("users").doc(user.displayName) // We get the user from the db whose id matches the name of the current user
      .onSnapshot(doc => {
        if (doc.exists) {
          setProfileInfo(doc.data()); // profileInfo is set with the data recieved from the db
          if (!match.params.channel) {
            let list = [doc.data().name, ...(doc.data().friends.map(user => user.name)), ...(doc.data().followingChannels.map(channel => channel.name))];
            while (list.length > 0) {
              let subList = list.splice(0, 10);
              db.collection("posts")
                .where("name", "in", subList)
                .orderBy("timestamp", "desc") // Sorting by timestamp descending allows the new posts to be shown on top
                .onSnapshot((snapshot) => {
                  setPosts(Array.from(new Set(posts.concat(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    key: doc.id,
                    data: doc.data(),
                  }))))).filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i).sort((a, b) => a.data.timestamp < b.data.timestamp))
                  setOpen(false);
                })
            }
          }
          else {
            db.collection("channels").where("name", "==", match.params.channel)
              .get().then(snapshot => {
                snapshot.forEach(channel => {
                  setChannelInfo({
                    id: channel.id,
                    data: channel.data()
                  })
                });
              })

            db.collection("posts")
              .where("name", "==", match.params.channel)
              .where("channelBy", "==", match.params.id)
              .orderBy("timestamp", "desc") // Sorting by timestamp descending allows the new posts to be shown on top
              .onSnapshot((snapshot) => {
                setPosts(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    key: doc.id,
                    data: doc.data(),
                  }))
                )
                setOpen(false)
              })
          }
          setTimeout(() => { setLoaded(true) }, 500)
        } else {
        }
      });
      // eslint-disable-next-line
  }, [user.displayName, match.params]);

  const [locationPosts, setLocationPosts] = useState([])

  useEffect(() => {
    db.collection("posts")
      .where("hasCoordinates", "==", true)
      .where("isPrivate", "==", false)
      .get().then((a) => {
        setLocationPosts(
          a.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      })

  }, [])

  const sendPost = async (e) => { // When the new post is submitted this function is called
    e.preventDefault(); // This is to prevent the default behaviour of submitting a form

    if (sliderImages.length) {

      const ref = db.collection('posts').doc() // A reference to the next entry to the database is created in advance
      if (coordinatesSelected) {
        ref.set({ // This adds a new post to the databse
          name: match.params.channel || user.displayName,
          description: user.email,
          message: input,
          photoUrl: user.photoUrl || "",
          largeGifs: largeImages,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          channelBy: (match.params.channel) ? user.displayName : "",
          hasCoordinates: true,
          lat: lat,
          lng: lng,
          stars: {},
          totalStars: 0,
          isPrivate: isPrivatePost,
          challenges: []
        })
      }
      else {
        ref.set({ // This adds a new post to the databse
          name: match.params.channel || user.displayName,
          description: user.email,
          message: input,
          photoUrl: user.photoUrl || "",
          largeGifs: largeImages,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          channelBy: (match.params.channel) ? user.displayName : "",
          hasCoordinates: false,
          stars: {},
          totalStars: 0,
          isPrivate: isPrivatePost,
          challenges: []
        })
      }


      sliderImages.forEach((image) => {
        db.collection('postImages').doc().set({
          url: image.src,
          styleModification: image.style,
          ref: ref.id,
          overlayGifs: image.overlayGifs !== undefined ? image.overlayGifs : [],
          overlayCoordinates: image.overlayCoordinates !== undefined ? image.overlayCoordinates : [],
          orignalDimensions: image.orignalDimensions,
          tags: image.tags
        });
      });

      resetVals();
    }
  };

  const resetVals = () => {
    setInputImg(""); // When the post is submitted the input image is set to an empty string removing the preview of the image and providing a fresh canvas for the next post
    setSliderImages([]);
    setLargeImages([]);
    setInput(""); // On posting the input value is set to an empty string
    setCameraActive("");
    setIsPrivatePost(false);
    setShowPostComponent(false);
    setCameraActive("");
    setImgOverlays([])
    setImgOverlayCoordinates([])
    setViewSlider(false)
  }

  const editingCancelled = async () => {
    setInputImg("");
    setIsPrivatePost(false);
    setImgOverlays([])
    setImgOverlayCoordinates([])
    setShowPostComponent(true);
  }


  const editingDone = async () => {
    setNohuman(false);

    if (inputImg) {

      var temp = sliderImages.concat({
        src: inputImg,
        style: getImageStyle(),
        overlayGifs: imgOverlays,
        overlayCoordinates: imgOverlayCoordinates,
        orignalDimensions: { width: w, height: h },
        tags: tags
      })
      setSliderImages(temp)
      setImgOverlays([])
      setTags([])
      setImgOverlayCoordinates([])
      setInputImg("");
      setShowPostComponent(true);

    }
  }

  const openCamera = (e) => { // On clicking the camera button this function is called
    e.preventDefault();
    setCameraActive("active"); // The camera state is set to active which renders the camera component 
  };

  const closeCamera = (e) => { // On clicking the camera closed button this function is called
    setCameraActive(""); // Setting this to an empty state stops the rendering of the camera component
  };

  const getData = (val) => {
    // do not forget to bind getData in constructor
    setLat(val.lat);
    setLng(val.lng);
  }

  const handleChange = (e) => { // When a file is uploaded this function is called

    e.preventDefault();
    setShowPostComponent(false)
    setViewSlider(false)
    {
      setFile(e.target.files[0]);
      const compress = new Compress();
      compress.compress([e.target.files[0]], {
        size: 0.7, // the max size in MB, defaults to 2MB
        quality: .65, // the quality of the image, max is 1,
        maxWidth: 1920, // the max width of the output image, defaults to 1920px
        maxHeight: 1920, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
      }).then((data) => {
        // returns an array of compressed images
        var compressedb64 = data[0].prefix + data[0].data;
        setInputImg(compressedb64);
        setTimeout(() => {


          setLoading(true);
          setW(overlayParentRef.current.clientWidth);
          setH(overlayParentRef.current.clientHeight);
          cocoSsd.load().then((model) => {

            // detect objects in the image.

            const img = document.getElementById("img");
            model.detect(img).then((predictions) => {

              if (predictions.length) {
                predictions.forEach((prediction) => {
                  if (prediction.class === "person") {
                    setInputImg("");
                    setShow(true);
                    setTimeout(() => { setShowPostComponent(true); }, 100)
                  }
                  else {
                    setNohuman(true);
                  }
                })
              }
              else {
                setNohuman(true);
              }
              setLoading(false);
            })
          });
        });
      }, 100);
      setCameraActive("");
    }
  };

  async function handleTakePhoto(dataUri) { // This function is called when the photo using the camera is taken
    setInputImg(dataUri)
    setCameraActive("");
    setLoading(true);
    await inputImg;
    setW(overlayParentRef.current.clientWidth);
    setH(overlayParentRef.current.clientHeight);
    setShowPostComponent(false)
    setViewSlider(false)
    cocoSsd.load().then((model) => {

      // detect objects in the image.

      const img = document.getElementById("img");
      model.detect(img).then((predictions) => {

        if (predictions.length) {
          predictions.forEach((prediction) => {
            if (prediction.class === "person") {
              setInputImg("");
              setShow(true);
              setTimeout(() => { setShowPostComponent(true); }, 100)
            }
            else {
              setNohuman(true);
            }
          })
        }
        else {
          setNohuman(true);
        }
        setLoading(false);
      })
    });
  }

  const followChannel = (e) => {
    db.collection("users").doc(profileInfo.name).update({
      followingChannels: firebase.firestore.FieldValue.arrayUnion({ name: match.params.channel, creator: match.params.id })
    });
    db.collection("channels").doc(channelInfo.id).update({
      followers: firebase.firestore.FieldValue.arrayUnion({ name: profileInfo.name, photoUrl: profileInfo.photoUrl })
    });

  }

  const unfollowChannel = (e) => {
    db.collection("users").doc(profileInfo.name).update({
      followingChannels: firebase.firestore.FieldValue.arrayRemove({ name: match.params.channel, creator: match.params.id })
    });
    db.collection("channels").doc(channelInfo.id).update({
      followers: firebase.firestore.FieldValue.arrayRemove({ name: profileInfo.name, photoUrl: profileInfo.photoUrl })
    });
  }

  const setFollowersList = (l) =>
  (l.map(item =>
    <ListItem
      key={item.name}
      button
      onClick={() => { setShowFollowers(false); history.push(`/user/${item.name}`) }
      }
    >
      <ListItemAvatar>
        <Avatar src={item.photoUrl} />
      </ListItemAvatar>
      <ListItemText primary={item.name} />
    </ListItem>
  ))

  const [imgOverlays, setImgOverlays] = useState([]) // imgOverlays = array of giffs ot stickers on the image.
  const [w, setW] = useState(0) // imgOverlays = array of giffs ot stickers on the image.
  const [h, setH] = useState(0) // imgOverlays = array of giffs ot stickers on the image.
  const [imgOverlayCoordinates, setImgOverlayCoordinates] = useState([])
  const [viewSlider, setViewSlider] = useState(false);
  const overlayParentRef = useRef() // Reference to the parent element of overlays.

  function handleOverlayClick(overlay) {
    /* When am overlay is clicked, it is added to the list of overlays
       causing it to be rendered on screen. */
    setImgOverlayCoordinates(imgOverlayCoordinates.concat({ x: 0, y: 0 }));
    setImgOverlays(imgOverlays.concat(overlay.images.original));
    /* Add new overlay url to the list of overlays. */

  }
  function removeOverlay(preview_gif, index) {
    setImgOverlays(imgOverlays.filter(obj => obj !== preview_gif))
    setImgOverlayCoordinates(imgOverlayCoordinates.splice(index, 1))
  }

  function getCoordinates(gif, index) {
    let x = document.getElementById(gif.url).getBoundingClientRect().x - overlayParentRef.current.getBoundingClientRect().left
    let y = document.getElementById(gif.url).getBoundingClientRect().y - overlayParentRef.current.getBoundingClientRect().top
    imgOverlayCoordinates[index] = { x: x, y: y }
    setImgOverlayCoordinates(imgOverlayCoordinates)
  }

  const [, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }

    window.addEventListener('resize', handleResize)

    return _ => {
      window.removeEventListener('resize', handleResize)

    }
  })
  const [showEditor, toggle] = useState(false);
  const closeImageEditor = () => { toggle(false) };
  const onComplete = (newUrl) => { setInputImg(newUrl.canvas.toDataURL('image/jpeg', 0.6)); closeImageEditor(); }
  const config = {
    translations: { en: { 'header.image_editor_title': 'Aperture', } },
    tools: ["crop", "shapes", "adjust", "effects", "filters", "rotate", "text"],
    replaceCloseWithBackButton: true,
    finishButtonLabel: "Continue"
  };
  const slider = <ImageGallery sliderImages={sliderImages} />


  //Add tags 
  const addTag = (e) => {
    if (e.key === "Enter") {
      if (e.target.value.length > 0) {
        setTags([...tags, e.target.value.toLowerCase()]);
      }
      e.target.value = ""
    }
  };

  //Remove tags
  const removeTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };


  return (
    <>


      <div className="App">

        <FilerobotImageEditor
          show={showEditor}
          src={inputImg}
          onComplete={onComplete}
          onBeforeComplete={props => {
            closeImageEditor();
            return false;
          }}
          onClose={closeImageEditor}
          config={config}

        />

      </div>

      <div className="feed">

        {(profileInfo && (match.params.channel)) ?
          <>
            <center>
              <h1>{match.params.channel}</h1>
            </center>
            <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", justifyItems: "center" }}>
              <div style={{ cursor: "pointer" }} onClick={() => setShowFollowers(true)} >Followers:{channelInfo && channelInfo.data.followers.length}</div>
              <Modal
                show={showFollowers}
                onHide={() => { setShowFollowers(false) }}
                keyboard={false}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Body>
                  {channelInfo.data && setFollowersList(channelInfo.data.followers)}
                </Modal.Body>
              </Modal>
              {(match.params.id !== user.displayName) ?
                (profileInfo.followingChannels.some(channel => channel.name === match.params.channel)) ?
                  <Button onClick={unfollowChannel} variant="success">Following</Button>
                  :
                  <Button onClick={followChannel} variant="outline-primary">Follow</Button>
                :
                <>
                </>
              }
            </div>
          </>
          :
          <div style={{ position: "sticky", top: "66px", zIndex: "100", backgroundColor: "whitesmoke", width: "108%", marginLeft: "-4%", overflow: "hidden" }}>
            <center>
              <h1>Home</h1>
            </center>
          </div>
        }
        {((match.params.id === user.displayName) || (match.path === "/")) && !showGifSearch && !showEditMap &&

          <Modal
            show={showPostComponent && !showGifSearch}
            onHide={() => { setShowPostComponent(false); resetVals(); }}
            keyboard={false}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton onClick={() => { setShowPostComponent(false) }}>
              {/* Sign Up Heading */}
              <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}>
                {(match.path === "/") ? <>{`Posting as ${user.displayName}`}</> : <>{`Posting in ${match.params.channel}`}</>}
              </h4>
            </Modal.Header>
            <Modal.Body>
              <div className="feed_inputContainer">
                {!showEditMap && <div className="feed_input">
                  <IconButton
                    aria-label="more"
                  >
                    <Avatar src={user.photoUrl}></Avatar>
                  </IconButton>
                  <form onSubmit={(e) => { e.preventDefault() }}>
                    <InputBase
                      className={classes.input}
                      placeholder="Optional Caption..."
                      inputProps={{ 'aria-label': 'caption' }}
                      value={input}
                      onChange={(e) => setInput(e.target.value)} // when the input is changed the input state variable is updated
                    />

                  </form>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={() => setIsPrivatePost(!isPrivatePost)}
                  >
                    {isPrivatePost ? <LockIcon /> : <PublicIcon />}
                  </IconButton>
                </div>}
                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "15px" }}>
                  {!inputImg && !showEditMap && <div className="upload-btn-wrapper">
                    <input type="file" name="myfile" id="myFile" accept="image/*" onChange={handleChange} style={{ opacity: "0" }} />
                    <label htmlFor="myFile">
                      <IconButton
                        aria-label="upload image"
                        component="span"
                      >
                        <ImageIcon fontSize="large" />
                      </IconButton>
                    </label>

                  </div>}
                  {!inputImg && !showEditMap &&
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
                  {!inputImg && !showEditMap && sliderImages.length > 0 &&

                    <label>
                      <IconButton
                        aria-label="open map"
                        component="span"
                        onClick={(e) => { e.preventDefault(); setShowEditMap(true) }}
                      >
                        <EditLocationIcon fontSize="large" />
                        {coordinatesSelected && <div style={{ color: "green" }}>✓</div>}
                      </IconButton>
                    </label>
                  }
                </div>

                {show &&
                  <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>Oh snap! Human Detected!</Alert.Heading>
                    <p>
                      The image uploaded had a Human detected in it!
                    </p>
                  </Alert>
                }



                {viewSlider && slider}
                {sliderImages.length > 0 && !showEditMap &&

                  <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    {(sliderImages.length > 0) && !showGifSearch && !viewSlider &&

                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<VisibilityIcon />}
                        onClick={() => { setViewSlider(true) }}
                      >
                        <b>Preview</b>
                      </Button>
                    }
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      endIcon={<SendIcon />}
                      onClick={sendPost}
                    >
                      <b>Post</b>
                    </Button>

                  </div>
                }
              </div>
            </Modal.Body>
          </Modal>

        }
        {!showEditor && !showTags &&
          <Modal
            show={Boolean(inputImg)}
            keyboard={false}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body>

              {inputImg && (
                <>
                  {(showGifSearch || loading) && <img src={inputImg}
                    className="post__image" id="img" alt="Preview" style={getImageStyle()} ref={overlayParentRef} ></img>}
                  {!showGifSearch && !loading && <ImageGallery sliderImages={[{
                    src: inputImg,
                    style: getImageStyle(),
                    overlayGifs: imgOverlays,
                    overlayCoordinates: imgOverlayCoordinates,
                    orignalDimensions: { width: w, height: h }
                  }]} ref={overlayParentRef} />}

                  <br />
                  {inputImg && !showEditor &&
                    <div className="photoEditor">
                      {/* Div in which to view the photo. */}

                      {!loading &&
                        <div>
                          <div>

                            {overlayParentRef.current !== null && showGifSearch && imgOverlays.map((gif, index) => {
                              return (

                                <motion.div
                                  id={gif.url}
                                  drag dragConstraints={overlayParentRef}
                                  dragElastic={0}
                                  style={{
                                    backgroundImage: "url(" + gif.url + ")",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    width: overlayParentRef.current.clientWidth / 5 + "px",
                                    height: (((overlayParentRef.current.clientWidth / 5) / gif.width) * gif.height) + "px",
                                    position: "absolute",
                                    top: overlayParentRef.current.offsetTop,
                                    left: overlayParentRef.current.offsetLeft,
                                  }}
                                  dragMomentum={false}
                                  onDragEnd={() => getCoordinates(gif, index)}
                                >
                                  <motion.div style={{ position: "absolute", top: "-10px", right: "-10px" }}><IconButton size="small" style={{ backgroundColor: "white" }} onClick={() => removeOverlay(gif)}><CloseIcon fontSize="small" /></IconButton></motion.div>
                                </motion.div >
                              )
                            })
                            }
                          </div>
                          {!showGifSearch && <center>
                            <IconButton
                              aria-label="edit button"
                              component="span"
                              onClick={(e) => { e.preventDefault(); toggle(true); setShowPostComponent(false) }}
                            >
                              <TuneIcon fontSize="large" />
                            </IconButton>
                            <IconButton
                              aria-label="add GIF"
                              component="span"
                              onClick={(e) => { e.preventDefault(); setShowGifSearch(true); setShowPostComponent(false) }}
                            >
                              <GifIcon fontSize="large" />
                            </IconButton>
                            <IconButton
                              aria-label="tags"
                              aria-controls="long-menu"
                              aria-haspopup="true"
                              onClick={() => { setShowTags(true); setShowPostComponent(false) }}
                            >
                              <LocalOfferIcon fontSize="large" />
                            </IconButton>
                          </center>}

                          {showGifSearch && <center>
                            <ReactGiphySearchbox
                              apiKey={GiphyApiKey}
                              onSelect={(item) => handleOverlayClick(item)}
                              masonryConfig={[
                                { columns: 2, imageWidth: 110, gutter: 5 },
                                { mq: "900px", columns: 3, imageWidth: 120, gutter: 5 }
                              ]}
                            />
                            <IconButton
                              component="span"
                              onClick={(e) => { e.preventDefault(); setShowGifSearch(false) }}
                            >
                              <DoneIcon fontSize="large" />
                            </IconButton>
                          </center>}
                        </div>}


                    </div>
                  }

                </>
              )}
              {loading &&
                <div>
                  <center>
                    <Spinner animation="border" role="status" />{' '}
                    Scanning Image...
                  </center>
                </div>}

              {!loading && !showGifSearch &&
                <div className="buttons" style={{ justifyContent: "space-evenly" }}>
                  <Button variant="contained" onClick={editingDone}>Add Image</Button>
                  <Button variant="contained" onClick={editingCancelled}>Cancel</Button>
                </div>
              }
            </Modal.Body>
          </Modal>
        }

        <Modal
          show={Boolean(cameraActive)}
          onHide={() => { setCameraActive("") }}
          keyboard={false}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>

            {cameraActive && (
              <div className="camera">
                <br></br>
                <Camera // Camera API
                  isImageMirror={false}
                  onTakePhoto={(dataUri) => {
                    handleTakePhoto(dataUri);
                  }}
                  idealFacingMode={FACING_MODES.ENVIRONMENT}
                  imageCompression={0.97}
                />
                <button onClick={closeCamera}>Close Camera</button>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/*Tags Modal*/}
        <Modal
          show={showTags}
          onHide={() => { setShowTags(false); }}
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
            <TextField className="tag-container" label="Add tags" margin="normal" variant="outlined" style={{ width: "100%" }}
              onKeyUp={addTag} />
            {tags.map((tag, index) => {
              return (
                <Chip
                  className="tag-chip"
                  label={tag}
                  onDelete={() => removeTag(tag)}
                  color="primary"

                />
              );
            })}
          </Modal.Body>
        </Modal>

        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {loaded && <FlipMove>
          {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
          {posts.length === 0 && !match.params.channel ? <center style= {{marginTop: "20vh"}}><h3>
            <br />
            No posts to show! <p />
            <h6>Add friends or follow channels to view Posts...<p /></h6>
            <h2>Go to the <b onClick={() => { history.push('/search') }} style={{ cursor: "pointer" }}>Explore Page</b></h2>
          </h3></center> : posts.map( // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
            ({
              id,
              data: { name, description, message, photoUrl, largeGifs, comments, channelBy, hasCoordinates, lat, lng, stars, totalStars, isPrivate, timestamp, type, challenges },
            }) => (
              <Post
                key={id}
                id={id}
                name={name}
                description={description}
                message={message}
                photoUrl={photoUrl}
                largeGifs={largeGifs}
                comments={comments}
                hasCoordinates={hasCoordinates}
                lat={lat}
                lng={lng}
                channelBy={channelBy}
                viewingUser={user}
                star={stars}
                totalStar={totalStars}
                isPrivate={isPrivate}
                timestamp={timestamp}
                type={type}
                isForumPost={Boolean(type)}
                challenges={challenges}
                locationPosts={locationPosts}
              >
              </Post>
            )
          )}
        </FlipMove>}
      </div>
      {(((match.params.channel) && (match.params.id === user.displayName)) || (match.path === "/")) &&
        <Fab className={classes.fab} color='primary' onClick={() => { setShowPostComponent(true) }}>
          <AddIcon className={classes.extendedIcon} />
        </Fab>
      }
      <Modal
        show={showEditMap}
        onHide={() => { setShowEditMap(false) }}
        keyboard={false}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <DraggableMap
            center={{ lat: lat, lng: lng }}
            height='30vh'
            zoom={15}
            sendData={getData}
            draggable={true}
            setCoordinatesSelected={setCoordinatesSelected}
            setShowEditMap={setShowEditMap}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Feed;
