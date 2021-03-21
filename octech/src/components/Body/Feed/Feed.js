import React, { useEffect, useState } from "react";
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
import Map from "../Map/Map";
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
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Menu from '@material-ui/core/Menu';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  extendedIcon: {
    // marginRight: theme.spacing(1),
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

function Feed({ match }, props) {
  const user = useSelector(selectUser);
  const history = useHistory();

  const [input, setInput] = useState("");
  const [profileInfo, setProfileInfo] = useState("");
  const [, setFile] = useState(null)
  const [inputImg, setInputImg] = useState("");
  const [inputImgs, setInputImgs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [cameraActive, setCameraActive] = useState("");
  const [editOptions, setEditOptions] = useState(DEFAULT_EDIT_OPTIONS);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const selectedOption = editOptions[selectedOptionIndex];
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


  const [channelInfo, setChannelInfo] = useState("")

  const cocoSsd = require('@tensorflow-models/coco-ssd');

  const classes = useStyles();
  const [cropper, setCropper] = useState("");
  const [cropping, setCropping] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(true);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getCropData = async () => {
    if (typeof cropper !== "undefined") {
      setInputImg(await cropper.getCroppedCanvas().toDataURL('image/jpeg', 0.5));
      setCropping(false);
    }
  };

  function handleSliderChange(value) {
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

  function getImageStyle() {
    const filters = editOptions.map(option => {
      return `${option.property}(${option.value}${option.unit})`
    })
    return { filter: filters.join(` `) }
  }

  // const fixDB =()=>{
  //   db.collection("users").get().then(result => {
  //     result.forEach(element => {
  //       db.collection("users").doc(element.id).update({
  //         // followingChannels:[],
  //         // friendRequestReceived:[],
  //         // friendRequestSent : [],
  //         // friends:[],
  //         // profilePoints:0,
  //         // blocked:[],
  //         // blockedBy:[],
  //         collections :[]
  //       })
  //     });
  //   })

  //   // db.collection("channels").get().then(result => {
  //   //   result.forEach(element => {
  //   //     db.collection("channels").doc(element.id).update({
  //   //       followers:[]
  //   //     })
  //   //   })
  //   // })

  //   // db.collection("posts").get().then(result => {
  //   //   result.forEach(element => {
  //   //     db.collection("posts").doc(element.id).update({
  //   //       stars:{},
  //   //       totalStars:0
  //   //     })
  //   //   })
  //   // });  

  // }
  // fixDB()

  useEffect(() => {
    db.collection("users").doc(user.displayName).get().then(doc => {
      console.log(doc.data())
      if (doc.data().notifyLeague) {
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
        } else {
          console.log("No such document!");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [user.displayName, match.params]);

  const sendPost = async (e) => { // When the new post is submitted this function is called
    e.preventDefault(); // This is to prevent the default behaviour of submitting a form
    console.log(sliderImages);

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
        console.log(image, "added to db");
        db.collection('postImages').doc().set({
          url: image.src,
          styleModification: image.style,
          ref: ref.id
        });
      });

      resetVals();
    }
  };

  const resetVals = () => {
    setInputImg(""); // When the post is submitted the input image is set to an empty string removing the preview of the image and providing a fresh canvas for the next post
    setEditOptions(DEFAULT_EDIT_OPTIONS); // This sets the slider values for editing the image to its default once the post is submitted which avoids applying old filters to the next image that is uploaded
    setSliderImages([]);
    setLargeImages([]);
    setInput(""); // On posting the input value is set to an empty string
    setCameraActive("");
    setIsPrivatePost(false);
    setShowPostComponent(false);
    setCropping("false");
    setCameraActive("");
  }

  const editingCancelled = async () => {
    setInputImg("");
    setEditOptions(DEFAULT_EDIT_OPTIONS);
    setIsPrivatePost(false);
  }

  // const editingDone = async () => {
  //   setNohuman(false);

  //   if (file) {

  //     if (file.size / (1024 * 1024) > 0.9) {
  //       if (file.type === 'image/gif') {
  //         console.log("Large gif using firebase storage");
  //         const storageRef = storage.ref();
  //         const fileRef = storageRef.child(user.displayName + file.name);
  //         fileRef.put(file).then(() => {
  //           fileRef.getDownloadURL().then((doc) => {
  //             console.log(doc);
  //             setInputImgs(inputImgs.concat(doc))
  //             setSliderImages(sliderImages.concat({
  //               src: doc,
  //               style: getImageStyle()
  //             }));
  //             console.log(sliderImages);
  //             var reference = user.displayName + file.name;
  //             console.log(file, "name  =  ", reference);
  //             setInputImg("");
  //             setEditOptions(DEFAULT_EDIT_OPTIONS);
  //             setLargeImages(largeImages.concat(reference));
  //           });
  //         });

  //       }
  //       else {
  //         const compress = new Compress();
  //         compress.compress([file], {
  //           size: 0.8, // the max size in MB, defaults to 2MB
  //           quality: .70, // the quality of the image, max is 1,
  //           maxWidth: 1920, // the max width of the output image, defaults to 1920px
  //           maxHeight: 1920, // the max height of the output image, defaults to 1920px
  //           resize: true, // defaults to true, set false if you do not want to resize the image width and height
  //         }).then((data) => {
  //           // returns an array of compressed images
  //           console.log(data);
  //           var compressedb64 = data[0].prefix + data[0].data;
  //           setInputImgs(inputImgs.concat(compressedb64))
  //           setSliderImages(sliderImages.concat({
  //             src: compressedb64,
  //             style: getImageStyle()
  //           }))
  //           console.log(sliderImages);
  //           console.log(file);
  //           setInputImg("");
  //           setEditOptions(DEFAULT_EDIT_OPTIONS);
  //         })
  //       }
  //     }
  //     else {
  //       setInputImgs(inputImgs.concat(inputImg))
  //       setSliderImages(sliderImages.concat({
  //         src: inputImg,
  //         style: getImageStyle()
  //       }))
  //       console.log(sliderImages);
  //       console.log(file);
  //       setInputImg("");
  //       setEditOptions(DEFAULT_EDIT_OPTIONS);
  //     }
  //   }
  //   else {
  //     setInputImgs(inputImgs.concat(inputImg))
  //     setSliderImages(sliderImages.concat({
  //       src: inputImg,
  //       style: getImageStyle()
  //     }))
  //     console.log(sliderImages);
  //     console.log(file);
  //     setInputImg("");
  //     setEditOptions(DEFAULT_EDIT_OPTIONS);
  //   }
  // }

  const editingDone = async () => {
    setNohuman(false);

    if (inputImg) {

      // if (file) {
      //   const compress = new Compress();
      //   compress.compress([file], {
      //     size: 0.7, // the max size in MB, defaults to 2MB
      //     quality: .65, // the quality of the image, max is 1,
      //     maxWidth: 1920, // the max width of the output image, defaults to 1920px
      //     maxHeight: 1920, // the max height of the output image, defaults to 1920px
      //     resize: true, // defaults to true, set false if you do not want to resize the image width and height
      //   }).then((data) => {
      //     // returns an array of compressed images
      //     console.log(data);
      //     var compressedb64 = data[0].prefix + data[0].data;
      //     setInputImgs(inputImgs.concat(compressedb64))
      //     setSliderImages(sliderImages.concat({
      //       src: compressedb64,
      //       style: getImageStyle()
      //     }))
      //     console.log(sliderImages);
      //     console.log(file);
      //     setInputImg("");
      //     setEditOptions(DEFAULT_EDIT_OPTIONS);
      //   })
      // }
      // else {
      setInputImgs(inputImgs.concat(inputImg))
      setSliderImages(sliderImages.concat({
        src: inputImg,
        style: getImageStyle()
      }))
      setInputImg("");
      setEditOptions(DEFAULT_EDIT_OPTIONS);

      // }
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
    console.log(val);
    setLat(val[0]);
    setLng(val[1]);
  }

  const handleChange = (e) => { // When a file is uploaded this function is called

    e.preventDefault();
    console.log(e.target.files[0]);
    setEditOptions(DEFAULT_EDIT_OPTIONS);

    {
      // reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
      setFile(e.target.files[0]);
      // cocoSsd.load();
      const compress = new Compress();
      compress.compress([e.target.files[0]], {
        size: 0.7, // the max size in MB, defaults to 2MB
        quality: .65, // the quality of the image, max is 1,
        maxWidth: 1920, // the max width of the output image, defaults to 1920px
        maxHeight: 1920, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
      }).then((data) => {
        // returns an array of compressed images
        console.log(data);
        var compressedb64 = data[0].prefix + data[0].data;
        setInputImg(compressedb64);

        setLoading(true);

        cocoSsd.load().then((model) => {

          // detect objects in the image.

          const img = document.getElementById("img");
          model.detect(img).then((predictions) => {

            console.log("Predictions: ", predictions);
            if (predictions.length) {
              predictions.forEach((prediction) => {
                if (prediction.class === "person") {
                  setInputImg("");
                  console.log("HUMAN DETECTED!!!")
                  setShow(true);
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
            setCropping(true);
          })
        });
      });
      setCameraActive("");
    }
  };

  async function handleTakePhoto(dataUri) { // This function is called when the photo using the camera is taken
    // console.log(dataUri);
    setInputImg(dataUri)
    setCameraActive("");
    setLoading(true);
    await inputImg;
    cocoSsd.load().then((model) => {

      // detect objects in the image.

      const img = document.getElementById("img");
      model.detect(img).then((predictions) => {

        console.log("Predictions: ", predictions);
        if (predictions.length) {
          predictions.forEach((prediction) => {
            if (prediction.class === "person") {
              setInputImg("");
              console.log("HUMAN DETECTED!!!")
              setShow(true);
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
        setCropping(true);
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

  return (
    <>
      <div className="feed">

        {/* {console.log(match,user,((match.params.id === user.displayName) || (match.path === "/feed")))} */}
        {(profileInfo && (match.params.channel)) ?
          <>
            <center>
              <h1>{match.params.channel}</h1>
            </center>
            <div style={{ display: "flex", justifyContent:"space-evenly", alignItems:"center", justifyItems: "center" }}>
              <div style={{cursor: "pointer"}} onClick={() => setShowFollowers(true)} >Followers:{channelInfo && channelInfo.data.followers.length}</div>
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
          <div style={{ position: "sticky", top: "66px", zIndex: "100", backgroundColor: "whitesmoke", width: "108%",marginLeft: "-4%",overflow: "hidden"}}>
            <center>
              <h1>Home</h1>
            </center>
          </div>
        }
        {((match.params.id === user.displayName) || (match.path === "/")) &&

          <Modal
            show={showPostComponent}
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
                <div className="feed_input">
                  <IconButton
                    aria-label="more"
                  >
                    <Avatar src={user.photoUrl}></Avatar>
                  </IconButton>
                  <form onSubmit={(e) => { e.preventDefault() }}>
                    {/* <input
                      className="feed_inputbox"
                      placeholder="Caption..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)} // when the input is changed the input state variable is updated
                      type="text"
                      required
                    /> */}
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
                </div>
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
                <Modal
                  show={inputImg}
                  onHide={() => { setInputImg("") }}
                  keyboard={false}
                  size="xl"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Body>

                    {inputImg && (
                      <>
                        {!loading && cropping &&
                          <div>
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
                              onInitialized={(instance) => {
                                setCropper(instance);
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                              <Button color="primary" onClick={getCropData}>Crop Image</Button>
                              <Button onClick={() => { setCropping(false) }}>Continue without cropping</Button>
                            </div>
                          </div>}
                        <br />
                        {/* <img src={inputImg} alt="Preview" className="previewImage" /> */}
                        {inputImg &&
                          <div className="photoEditor">
                            {/* Div in which to view the photo. */}
                            <img src={inputImg}
                              className="previewImage" id="img" alt="Preview" style={getImageStyle()}></img>
                            {!loading &&
                              <div>
                                <br /><br />
                                <Button aria-controls="simple-menu" aria-haspopup="true" endIcon={<ExpandMoreIcon />} onClick={handleMenuClick} centered>
                                  {editOptions[selectedOptionIndex].name}
                                </Button>
                                <Menu
                                  id="simple-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={Boolean(anchorEl)}
                                  onClose={handleClose}
                                >
                                  {editOptions.map((option, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        onClick={() => { setSelectedOptionIndex(index); setAnchorEl(null) }}
                                      >{option.name}</MenuItem>
                                    )
                                  })}
                                </Menu><br></br>
                                <Slider
                                  min={selectedOption.range.min}
                                  max={selectedOption.range.max}
                                  value={selectedOption.value}
                                  onChange={(event, result) => { handleSliderChange(result) }}
                                />
                              </div>}


                          </div>
                        }
                        {/* Slider to adjust edit values. */}


                      </>
                    )}
                    {loading &&
                      <div>
                        <Spinner animation="border" role="status">
                        </Spinner>
                        <span>{'  '}Scanning Image...</span>
                      </div>}
                    {(!loading) && !cropping &&
                      <div className="buttons" style={{ justifyContent: "space-evenly" }}>
                        <Button variant="contained" onClick={editingDone}>Add Image</Button>
                        <Button variant="contained" onClick={editingCancelled}>Cancel</Button>
                      </div>
                    }

                  </Modal.Body>
                </Modal>{showEditMap &&
                  <>
                    <Map
                      center={{ lat: lat, lng: lng }}
                      height='30vh'
                      zoom={15}
                      sendData={getData}
                      draggable={true}
                      setCoordinatesSelected={setCoordinatesSelected}
                      setShowEditMap={setShowEditMap}
                    />

                  </>
                }
                {sliderImages && !showEditMap && <ImageGallery sliderImages={sliderImages} />}
                {sliderImages.length > 0 && !showEditMap &&

                  <center style={{ marginTop: "15px" }}>
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
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <FlipMove>
          {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
          {posts.map( // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
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
              >
              </Post>
            )
          )}
        </FlipMove>
      </div>
      {(((match.params.channel) && (match.params.id === user.displayName)) || (match.path === "/")) &&
        <Fab className={classes.fab} color='primary' onClick={() => { setShowPostComponent(true) }}>
          <AddIcon className={classes.extendedIcon} />
          {/* <b>New Post</b> */}
        </Fab>
      }
    </>
  );
}

export default Feed;
