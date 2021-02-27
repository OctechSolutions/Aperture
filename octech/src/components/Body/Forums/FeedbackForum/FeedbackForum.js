import React, { useState, useEffect } from "react";
import "./FeedbackForum.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/userSlice";
import { db } from "../../../../firebase";
import firebase from "firebase";
import Modal from "react-bootstrap/Modal";
import Divider from "@material-ui/core/Divider";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { Link } from "react-router-dom";
import CommentIcon from "@material-ui/icons/Comment";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import InputAdornment from "@material-ui/core/InputAdornment";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { Avatar } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import FlipMove from "react-flip-move";
import Post from "../../Post/Post";
import moment from "moment";
import FullscreenIcon from "@material-ui/icons/Fullscreen";

const Compress = require("compress.js");

function FeedbackForum(
  { feedbacks, id, photoUrl, timestamp, message, name },
  ref
) {
  if (feedbacks === undefined) {
    feedbacks = [];
  }

  const user = useSelector(selectUser);
  const [feedback, setFeedback] = useState("");
  const [sliderImages, setSliderImages] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPostComponent, setShowPostComponent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputImg, setInputImg] = useState("");
  const [finalImg, setFinalImg] = useState("");
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [cameraActive, setCameraActive] = useState("");
  const [file, setFile] = useState(null);
  const [, setNohuman] = useState(false);
  const [posts, setPosts] = useState([]);
  const [timeStamp, setTimeStamp] = useState(0);

  const cocoSsd = require("@tensorflow-models/coco-ssd");

  // For the styling of the floating button. (related to material ui)
  const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 500,
      position: "relative",
      minHeight: 200
    },
    fab: {
      margin: 0,
      top: "auto",
      right: 20,
      bottom: 150,
      left: "auto",
      position: "fixed"
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    }
  }));

  // Adds posts to a list of posts.
  const addPosts = post => {
    if (
      posts.length > 0 &&
      post.length > 0 &&
      post[post.length - 1].id === posts[0].id
    )
      post.splice(-1, 1);
    let newPosts = posts.concat(post);
    newPosts.sort((a, b) => a.data.timestamp < b.data.timestamp);
    setPosts(newPosts);
    if (newPosts.length > 0) setTimeStamp(newPosts[0].data.timestamp);
  };

  const classes = useStyles(); // For the floating button. (related to material ui)

  const handleImagesUpload = async e => {
    // When a file is uploaded this function is called
    e.preventDefault();
    const compress = new Compress();
    compress
      .compress([...e.target.files], {
        size: 0.8, // the max size in MB, defaults to 2MB
        quality: 0.5, // the quality of the image, max is 1,
        maxWidth: 1920, // the max width of the output image, defaults to 1920px
        maxHeight: 1920, // the max height of the output image, defaults to 1920px
        resize: true // defaults to true, set false if you do not want to resize the image width and height
      })
      .then(data => {
        // returns an array of compressed images
        const temp = [];
        data.forEach(a => {
          var compressedb64 = a.prefix + a.data;
          temp.push(compressedb64);
        });
        console.log(temp);
        setSliderImages(sliderImages.concat(temp));
      });
  };

  const sendPost = async e => {
    // When the new post is submitted this function is called
    e.preventDefault(); // This is to prevent the default behaviour of submitting a form
    if (input.replace(/\s/g, "").length) {
      // This if condition checks if the caption is not empty, we can make it if(input && inputImage) later to check if the image as well is uploaded but for testing puroses just making a text post is easier
      const ref = db.collection("feedbackForum").doc(); // A reference to the next entry to the database is created in advance
      ref.set({
        // This adds a new post to the database
        name: user.displayName,
        description: user.email,
        message: input,
        photoUrl: user.photoUrl || "",
        largeGifs: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        channelBy: "",
        hasCoordinates: true,
        lat: 0,
        lng: 0,
        stars: {},
        totalStars: 0,
        isPrivate: false,
        url: finalImg
      });
      console.log(finalImg, "added to db");
    }

    setInputImg(""); // When the post is submitted the input image is set to an empty string removing the preview of the image and providing a fresh canvas for the next post
    setInput(""); // On posting the input value is set to an empty string
    setShowPostComponent(false);
  };

  const handleChange = async e => {
    // When a file is uploaded this function is called.
    e.preventDefault();
    var reader = new FileReader();
    console.log(e.target.files[0]);

    // Load image.
    if (e.target.files[0] !== undefined) {
      reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
      setFile(e.target.files[0]);
      cocoSsd.load();
    }
    reader.onloadend = function() {
      // Since this is asyncronous on completion of the loading the image is set with the base64 string
      console.log("RESULT", reader.result);
      setInputImg(reader.result);
      setFinalImg(reader.result);
      // alert("Image Uploaded Sucessfully!")
      setLoading(true);
      cocoSsd.load().then(model => {
        // detect objects in the image.
        const img = document.getElementById("img");
        model.detect(img).then(predictions => {
          console.log("Predictions: ", predictions);
          if (predictions.length) {
            predictions.forEach(prediction => {
              if (prediction.class === "person") {
                setInputImg("");
                console.log("HUMAN DETECTED!!!");
                setShow(true);
              } else {
                setNohuman(true);
              }
            });
          } else {
            setNohuman(true);
          }
          setLoading(false);
          setInputImg("");
        });
      });
    };
  };

  useEffect(() => {
    db.collection("feedbackForum")
      .where("name", "==", user.displayName)
      .get()
      .then(snapshot =>
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            key: doc.id,
            data: doc.data()
          }))
        )
      );
  }, [posts]);

  const feedbackModal = () => {
    return (
      <Modal
        show={showFeedback}
        keyboard={false}
        onHide={() => {
          setShowFeedback(false);
        }}
        size="l"
        aria-labelledby="contained-modal-title-vcenter"
        scrollable={true}
        centered
      >
        <Modal.Header
          closeButton
          onClick={() => {
            setShowFeedback(false);
          }}
        >
          <h3>Feedback</h3>
        </Modal.Header>
        <Modal.Body>
          <TextField
            variant="outlined"
            margin="normal"
            multiline
            rowsMax={4}
            fullWidth
            value={feedback}
            name="feedbackBox"
            label="Feedback"
            id="feedbackBox"
            onKeyPress={ev => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                postFeedback();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={postFeedback}
                    onMouseDown={() => {}}
                    edge="end"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            onChange={e => setFeedback(e.target.value)}
          />
          {feedbacks
            .sort((a, b) => b.number - a.number)
            .map(c => {
              return (
                <div>
                  <Link
                    style={{
                      textDecoration: "none",
                      fontSize: "20px",
                      color: "black"
                    }}
                    to={`/user/${c.name}`}
                  >
                    <b>{c.name}</b>
                  </Link>{" "}
                  {c.feedback}
                </div>
              );
            })}
        </Modal.Body>
      </Modal>
    );
  };

  const postFeedback = () => {
    console.log(feedback, id);
    if (feedback.replace(/\s/g, "").length) {
      db.collection("feedbackForum")
        .doc(id)
        .update({
          feedbacks: firebase.firestore.FieldValue.arrayUnion({
            name: user.displayName,
            feedback: feedback,
            number: feedback.length
          })
        });
      setFeedback("");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Fab
        variant="extended"
        className={classes.fab}
        color="primary"
        onClick={() => {
          setShowPostComponent(true);
        }}
      >
        <AddCircleOutlineIcon className={classes.extendedIcon} />
        <b>New Post</b>
      </Fab>

      {/* POPUP Add Post. */}
      <Modal
        show={showPostComponent}
        onHide={() => {
          setShowPostComponent(false);
        }}
        keyboard={false}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          onClick={() => {
            setShowPostComponent(false);
          }}
        >
          <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}>
            Let's get some Feedback!
          </h4>
        </Modal.Header>
        <Modal.Body>
          <div className="feed_inputContainer">
            {/* Profile Pic, Caption and Image Preview */}
            <div className="feed_input">
              <Avatar src={user?.photoUrl}></Avatar>{" "}
              {/*Avatar using materialui*/}
              <form onSubmit={sendPost}>
                <input
                  className="feed_inputbox"
                  placeholder="Any particular aspect you'd like feedback on?"
                  value={input}
                  onChange={e => setInput(e.target.value)} // when the input is changed the input state variable is updated
                  type="text"
                  required
                />
                <div className="imagePreview">
                  <div className="buttons">
                    {!inputImg && (
                      <div className="upload-btn-wrapper">
                        <button className="btn">
                          <ImageIcon />
                        </button>
                        <input
                          type="file"
                          name="myfile"
                          onChange={handleChange}
                        />
                      </div>
                    )}

                    {!inputImg && (
                      <button onClick={sendPost} type="submit">
                        Post
                      </button>
                    )}
                  </div>
                </div>
                <img
                  src={finalImg}
                  className="previewImage"
                  id="img"
                  alt="Preview"
                ></img>
              </form>
            </div>

            {/* Human Detection */}
            {show && (
              <Alert
                variant="danger"
                onClose={() => setShow(false)}
                dismissible
              >
                <Alert.Heading>Oh snap! Human Detected!</Alert.Heading>
                <p>The image uploaded had a Human detected in it!</p>
              </Alert>
            )}

            {/* Scanning Image Spinner */}
            <Modal
              show={inputImg}
              onHide={() => {
                setInputImg("");
              }}
              keyboard={false}
              size="xl"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Body>
                {loading && (
                  <div>
                    <Spinner animation="border" role="status"></Spinner>
                    <span>{"  "}Scanning Image...</span>
                  </div>
                )}
              </Modal.Body>
            </Modal>
          </div>
        </Modal.Body>
      </Modal>
      {/* To Display the Posts */}
      <FlipMove>
        {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
        {posts.map(
          // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
          ({
            id,
            data: {
              name,
              description,
              message,
              photoUrl,
              largeGifs,
              feedbacks,
              channelBy,
              hasCoordinates,
              lat,
              lng,
              stars,
              totalStars,
              isPrivate,
              timestamp,
              url
            }
          }) => (
            <div
              className="feedbackPost"
              style={{
                width: "50vw",
                marginBottom: "5rem"
              }}
            >
              <div style={{ display: "flex" }}>
                <Avatar src={photoUrl || ""}></Avatar>
                <h3>{" " + name}</h3>
              </div>
              <br />
              <img
                style={{
                  width: "100%",
                  borderRadius: "25px"
                }}
                src={url}
              ></img>
              <div>
                <IconButton
                  aria-label="comments"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={() => {
                    setShowFeedback(true);
                  }}
                >
                  <CommentIcon />
                </IconButton>
                <IconButton
                  aria-label="comments"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={() => setShow(true)}
                ></IconButton>
              </div>
              {feedbackModal()}
            </div>
          )
        )}
      </FlipMove>
    </>
  );
}

export default FeedbackForum;
