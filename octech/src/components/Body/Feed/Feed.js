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

function Feed(props) {
  const user = useSelector(selectUser);

  const [input, setInput] = useState("");
  const [inputImg, setInputImg] = useState("");
  const [posts, setPosts] = useState([]);
  const [cameraActive, setCameraActive] = useState("");

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
      db.collection("posts").add({
        name: user.displayName,
        description: user.email,
        message: input,
        photoUrl: user.photoUrl || "",
        photoBase: inputImg || "",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
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
            <img src={inputImg} alt="Preview" className="previewImage" />
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
            data: { name, description, message, photoUrl, photoBase },
          }) => (
            <Post
              key={id}
              id={id}
              name={name}
              description={description}
              message={message}
              photoUrl={photoUrl}
              photoBase={photoBase}
            />
          )
        )}
      </FlipMove>
    </div>
  );
}

export default Feed;
