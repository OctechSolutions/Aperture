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
import { Slider, EditOption } from '../ImageManipulation';

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

function Feed() {
  const user = useSelector(selectUser);

  const [input, setInput] = useState("");
  const [inputImg, setInputImg] = useState("");
  const [posts, setPosts] = useState([]);
  const [cameraActive, setCameraActive] = useState("");
  const [editOptions, setEditOptions] = useState(DEFAULT_EDIT_OPTIONS)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const selectedOption = editOptions[selectedOptionIndex]

  function handleSliderChange(event) {
    setEditOptions(prevEditOptions => {
      return (
        (prevEditOptions.map((option, index) => {

          if (index !== selectedOptionIndex) {
            return option
          }
          return { ...option, value: event.target.value }
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


  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const sendPost = (e) => {
    e.preventDefault();

    if (input) {
      setInputImg("");
      setEditOptions(DEFAULT_EDIT_OPTIONS);

      const ref = db.collection('posts').doc()

      ref.set({
        name: user.displayName,
        description: user.email,
        message: input,
        photoUrl: user.photoUrl || "",
        photoBase: inputImg || "",
        styleModification: getImageStyle(editOptions),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })

      console.log(ref.id)
      db.collection("users").doc(user.displayName).update({
        posts: firebase.firestore.FieldValue.arrayUnion(ref.id)
      })

      setInput("");
      setCameraActive("");
    }
  };

  const openCamera = (e) => {
    e.preventDefault();
    setCameraActive("active");
  };

  const closeCamera = (e) => {
    setCameraActive("");
  };

  const handleChange = (e) => {
    setCameraActive("");
    e.preventDefault();
    var reader = new FileReader();
    console.log(e.target.files[0]);
    setEditOptions(DEFAULT_EDIT_OPTIONS);

    if (e.target.files[0] !== undefined) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onloadend = function () {
      console.log("RESULT", reader.result);
      setInputImg(reader.result);
      // alert("Image Uploaded Sucessfully!")
    };
  };

  function handleTakePhoto(dataUri) {
    console.log(dataUri);
    setInputImg(dataUri);
    // alert("Image Uploaded Sucessfully!");
    setCameraActive("");
  }

  return (
    <div className="feed">
      <div className="feed_inputContainer">
        <div className="feed_input">
          <Avatar src={user?.photoUrl}></Avatar>
          <form onSubmit={sendPost}>
            <input
              className="feed_inputbox"
              placeholder="Caption..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              required
            />
            <div className="imagePreview">
              <div className="buttons">
                <div className="upload-btn-wrapper">
                  <button className="btn">
                    <ImageIcon />
                  </button>
                  <input type="file" name="myfile" onChange={handleChange} />
                </div>
                <button className="btn" onClick={openCamera}>
                  <PhotoCameraIcon />
                </button>

                <button onClick={sendPost} type="submit">
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
        {inputImg && (
          <>
            <br />
            {/* <img src={inputImg} alt="Preview" className="previewImage" /> */}
            <div className="photoEditor">
              {/* Div in which to view the photo. */}
              <img src={inputImg}
                className="previewImage" alt="Preview" style={getImageStyle()}></img>
              {console.log(getImageStyle())}
              <br></br>
              {/* Div with 6 options like brightness, contrast, etc. */}
              <div className="row">
                {editOptions.map((option, index) => {
                  return (
                    <EditOption
                      key={index}
                      name={option.name}
                      active={index === selectedOptionIndex ? true : false}
                      handleClick={() => setSelectedOptionIndex(index)}
                    />
                  )
                })}
              </div>
              <br></br>
            </div>
            {/* Slider to adjust edit values. */}
            <Slider
              min={selectedOption.range.min}
              max={selectedOption.range.max}
              value={selectedOption.value}
              handleChange={handleSliderChange}
            />

          </>
        )}
      </div>

      {cameraActive && (
        <div className="camera">
          <br></br>
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
          />
          <button onClick={closeCamera}>Close Camera</button>
        </div>
      )}

      <FlipMove>
        {posts.map(
          ({
            id,
            data: { name, description, message, photoUrl, photoBase, styleModification },
          }) => (
            <Post
              key={id}
              id={id}
              name={name}
              description={description}
              message={message}
              photoUrl={photoUrl}
              photoBase={photoBase}
              styleModification={styleModification}
            />
          )
        )}
      </FlipMove>
    </div>
  );
}

export default Feed;
