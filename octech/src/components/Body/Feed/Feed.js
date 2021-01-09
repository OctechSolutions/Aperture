import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Avatar } from "@material-ui/core";
import Post from "../Post/Post";
import { db, storage } from "../../../firebase";
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
  const [file, setFile] = useState(null)
  const [inputImg, setInputImg] = useState("");
  const [posts, setPosts] = useState([]);
  const [largeFile, setLargeFile] = useState("");
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


  useEffect(() => { // This useEffect is called on the component mounting, it fetches all the posts from the db and stores them into the posts array
    db.collection("posts")
      .orderBy("timestamp", "desc") // Sorting by timestamp descending allows the new posts to be shown on top
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const sendPost = async (e) => { // When the new post is submitted this function is called
    e.preventDefault(); // This is to prevent the default behaviour of submitting a form

    if (input) { // This if condition checks if the caption is not empty, we can make it if(input && inputImage) later to check if the image as well is uploaded but for testing puroses just making a text post is easier
      setInputImg(""); // When the post is submitted the input image is set to an empty string removing the preview of the image and providing a fresh canvas for the next post
      setEditOptions(DEFAULT_EDIT_OPTIONS); // This sets the slider values for editing the image to its default once the post is submitted which avoids applying old filters to the next image that is uploaded


      if (largeFile === "") {
        const ref = db.collection('posts').doc() // A reference to the next entry to the database is created in advance
        console.log("Small file using base64");
        ref.set({ // This adds a new post to the databse
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
          posts: firebase.firestore.FieldValue.arrayUnion(ref.id) // The new posts id is added to the users db by appending it to the posts array
        })
      }

      else {
        const ref = db.collection('posts').doc(file.name) // A reference to the next entry to the database is created in advance
        console.log("Large file using firebase storage");
        const storageRef = storage.ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        ref.set({ // This adds a new post to the database
          name: user.displayName,
          description: user.email,
          message: input,
          photoUrl: user.photoUrl || "",
          photoBase: await fileRef.getDownloadURL() || "",
          styleModification: getImageStyle(editOptions),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        console.log(ref.id)
        db.collection("users").doc(user.displayName).update({
          posts: firebase.firestore.FieldValue.arrayUnion(ref.id) // The new posts id is added to the users db by appending it to the posts array
        })
      }



      setInput(""); // On posting the input value is set to an empty string
      setCameraActive("");
      setLargeFile("")
    }
  };

  const openCamera = (e) => { // On clicking the camera button this function is called
    e.preventDefault();
    setCameraActive("active"); // The camera state is set to active which renders the camera component 
  };

  const closeCamera = (e) => { // On clicking the camera closed button this function is called
    setCameraActive(""); // Setting this to an empty state stops the rendering of the camera component
  };

  const handleChange = (e) => { // When a file is uploaded this function is called
    setCameraActive("");
    e.preventDefault();
    var reader = new FileReader();
    console.log(e.target.files[0]);
    setEditOptions(DEFAULT_EDIT_OPTIONS);

    if (e.target.files[0] !== undefined) {
      reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
      setFile(e.target.files[0]);
    }
    reader.onloadend = function () { // Since this is asyncronous on completion of the loading the image is set with the base64 string
      console.log("RESULT", reader.result);
      setInputImg(reader.result);
      if (reader.result.length > 980000) {
        setLargeFile("Large File");
      }
      else {
        setLargeFile("")
      }
      // alert("Image Uploaded Sucessfully!")
    };
  };

  function handleTakePhoto(dataUri) { // This function is called when the photo using the camera is taken
    console.log(dataUri);
    setInputImg(dataUri); // The inputImg is set with the result that is returned from the camera
    // alert("Image Uploaded Sucessfully!");
    setCameraActive("");
  }

  return (
    <div className="feed">
      <div className="feed_inputContainer">
        <div className="feed_input">
          <Avatar src={user?.photoUrl}></Avatar> {/*Avatar using materialui*/}
          <form onSubmit={sendPost}>
            <input
              className="feed_inputbox"
              placeholder="Caption..."
              value={input}
              onChange={(e) => setInput(e.target.value)} // when the input is changed the input state variable is updated
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
                {
                  editOptions.map((option, index) => {
                    return (
                      <EditOption
                        key={index}
                        name={option.name}
                        active={index === selectedOptionIndex ? true : false}
                        handleClick={() => setSelectedOptionIndex(index)}
                      />
                    )
                  })
                }
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
          <Camera // Camera API
            isImageMirror={false}
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
          />
          <button onClick={closeCamera}>Close Camera</button>
        </div>
      )}

      <FlipMove>
        {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
        {posts.map( // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
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
