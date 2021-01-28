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
import ImageGallery from "./ImageGallery";
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import Map from "../Map/Map";
import Button from 'react-bootstrap/Button';
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');


const Compress = require('compress.js');


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

  const [input, setInput] = useState("");
  const [profileInfo, setProfileInfo] = useState("");
  const [file, setFile] = useState(null)
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

  const cocoSsd = require('@tensorflow-models/coco-ssd');

  const addPosts = post =>{
    let newPosts = posts.concat(post);
    newPosts.sort((a,b)=> a.data.timestamp.valueOf() < b.data.timestamp.valueOf())
    setPosts(newPosts);
  }
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

  // const fixDB =()=>{
  //   db.collection("posts").get().then(result => {
  //     result.forEach(element => {
  //       if(element.data().channel!=""){
  //         db.collection("posts").doc(element.id).update({
  //           channelBy:element.data().name,
  //           name : element.data().channel,
  //           channel:"",
  //         })
  //       }
  //       else{
  //         db.collection("posts").doc(element.id).update({
  //           channelBy:""
  //         })
  //       }
  //     });
  //   })
    
  // }
  // fixDB()
  useEffect(() => { // This useEffect is called on the component mounting, it fetches all the posts from the db and stores them into the posts array
    db.collection("users").doc(user.displayName) // We get the user from the db whose id matches the name of the current user
      .onSnapshot(doc => {
        if (doc.exists) {
          setProfileInfo(doc.data()); // profileInfo is set with the data recieved from the db
          if(!match.params.channel){
            let list = [doc.data().name,...doc.data().friends,...doc.data().followingChannels];
            while (list.length>0){
              let subList = list.splice(0,10);
              db.collection("posts")
                .where("name","in",subList)
                .orderBy("timestamp", "desc") // Sorting by timestamp descending allows the new posts to be shown on top
                .onSnapshot((snapshot) =>
                  addPosts(
                    snapshot.docs.map((doc) => ({
                      id: doc.id,
                      key:doc.id,
                      data: doc.data(),
                    }))
                  )                  
                );
            }
          }
          else{
            db.collection("posts")
            .where("name","==",match.params.channel)
            .where("channelBy","==",match.params.id)
            .orderBy("timestamp", "desc") // Sorting by timestamp descending allows the new posts to be shown on top
            .onSnapshot((snapshot) =>
              setPosts(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  key:doc.id,
                  data: doc.data(),
                }))
              )                  
            );
          }
        } else {
          console.log("No such document!");
        }
      });
    }, [user.displayName]);
    
  const sendPost = async (e) => { // When the new post is submitted this function is called
    e.preventDefault(); // This is to prevent the default behaviour of submitting a form
    console.log(sliderImages);

    if (input.replace(/\s/g, '').length) { // This if condition checks if the caption is not empty, we can make it if(input && inputImage) later to check if the image as well is uploaded but for testing puroses just making a text post is easier

      const ref = db.collection('posts').doc() // A reference to the next entry to the database is created in advance
      if (coordinatesSelected) {
        ref.set({ // This adds a new post to the databse
          name: match.params.channel || user.displayName,
          description: user.email,
          message: input,
          photoUrl: user.photoUrl || "",
          largeGifs: largeImages,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          channelBy: (match.params.channel) ? user.displayName : "" ,
          hasCoordinates: true,
          lat: lat,
          lng: lng,
          stars: {},
          totalStars: 0
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
          channelBy: (match.params.channel) ? user.displayName : "" ,
          hasCoordinates: false,
          stars: {},
          totalStars: 0
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

      setInputImg(""); // When the post is submitted the input image is set to an empty string removing the preview of the image and providing a fresh canvas for the next post
      setEditOptions(DEFAULT_EDIT_OPTIONS); // This sets the slider values for editing the image to its default once the post is submitted which avoids applying old filters to the next image that is uploaded
      setSliderImages([]);
      setLargeImages([]);
      setInput(""); // On posting the input value is set to an empty string
      setCameraActive("");
    }
  };

  const editingCancelled = async () => {
    setInputImg("");
    setEditOptions(DEFAULT_EDIT_OPTIONS);
  }

  const editingDone = async () => {
    setNohuman(false);

    if (file) {

      if (file.size / (1024 * 1024) > 0.9) {
        if (file.type === 'image/gif') {
          console.log("Large gif using firebase storage");
          const storageRef = storage.ref();
          const fileRef = storageRef.child(user.displayName + file.name);
          fileRef.put(file).then(() => {
            fileRef.getDownloadURL().then((doc) => {
              console.log(doc);
              setInputImgs(inputImgs.concat(doc))
              setSliderImages(sliderImages.concat({
                src: doc,
                style: getImageStyle()
              }));
              console.log(sliderImages);
              var reference = user.displayName + file.name;
              console.log(file, "name  =  ", reference);
              setInputImg("");
              setEditOptions(DEFAULT_EDIT_OPTIONS);
              setLargeImages(largeImages.concat(reference));
            });
          });

        }
        else {
          const compress = new Compress();
          compress.compress([file], {
            size: 0.8, // the max size in MB, defaults to 2MB
            quality: .70, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
          }).then((data) => {
            // returns an array of compressed images
            console.log(data);
            var compressedb64 = data[0].prefix + data[0].data;
            setInputImgs(inputImgs.concat(compressedb64))
            setSliderImages(sliderImages.concat({
              src: compressedb64,
              style: getImageStyle()
            }))
            console.log(sliderImages);
            console.log(file);
            setInputImg("");
            setEditOptions(DEFAULT_EDIT_OPTIONS);
          })
        }
      }
      else {
        setInputImgs(inputImgs.concat(inputImg))
        setSliderImages(sliderImages.concat({
          src: inputImg,
          style: getImageStyle()
        }))
        console.log(sliderImages);
        console.log(file);
        setInputImg("");
        setEditOptions(DEFAULT_EDIT_OPTIONS);
      }
    }
    else {
      setInputImgs(inputImgs.concat(inputImg))
      setSliderImages(sliderImages.concat({
        src: inputImg,
        style: getImageStyle()
      }))
      console.log(sliderImages);
      console.log(file);
      setInputImg("");
      setEditOptions(DEFAULT_EDIT_OPTIONS);
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

  const handleChange = async (e) => { // When a file is uploaded this function is called
    setCameraActive("");
    e.preventDefault();
    var reader = new FileReader();
    console.log(e.target.files[0]);
    setEditOptions(DEFAULT_EDIT_OPTIONS);

    if (e.target.files[0] !== undefined) {
      reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
      setFile(e.target.files[0]);
      cocoSsd.load();
    }
    reader.onloadend = function () { // Since this is asyncronous on completion of the loading the image is set with the base64 string
      console.log("RESULT", reader.result);
      setInputImg(reader.result);
      // alert("Image Uploaded Sucessfully!")
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
        })
      });
    };
  };
  
  async function handleTakePhoto(dataUri) { // This function is called when the photo using the camera is taken
    console.log(dataUri);
    setInputImg(await dataUri); // The inputImg is set with the result that is returned from the camera
    // alert("Image Uploaded Sucessfully!");
    setCameraActive("");
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
      })
    });
  }

  const followChannel = (e) => {
    db.collection("users").doc(profileInfo.name).update({
      followingChannels: firebase.firestore.FieldValue.arrayUnion(match.params.channel)
    });
  }

  const unfollowChannel = (e) => {
    db.collection("users").doc(profileInfo.name).update({
      followingChannels: firebase.firestore.FieldValue.arrayRemove(match.params.channel)
    });
  }

  return (
    <div className="feed">
      {/* {console.log(match,user,((match.params.id === user.displayName) || (match.path === "/feed")))} */}
      {(profileInfo && (match.params.id !== user.displayName) && (match.params.channel)) ?
        <center>
          <h1>{match.params.channel}</h1>
          {(profileInfo.followingChannels.includes(match.params.channel)) ?
            <Button onClick={unfollowChannel} variant="success">Following</Button>
            :
            <Button onClick={followChannel} variant="outline-primary">Follow</Button>}
        </center>
        :
        <>
        </>}
      {((match.params.id === user.displayName) || (match.path === "/")) &&
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
                  {!inputImg && !showEditMap && <div className="upload-btn-wrapper">
                    <button className="btn">
                      <ImageIcon />
                    </button>
                    <input type="file" name="myfile" onChange={handleChange} />
                  </div>}
                  {!inputImg && !showEditMap && <button className="btn" onClick={openCamera}>
                    <PhotoCameraIcon />
                  </button>}
                  {!inputImg && !showEditMap && <button className="btn" onClick={(e) => { e.preventDefault(); setShowEditMap(true) }}>
                    <EditLocationIcon />
                  </button>}

                  {!inputImg && !showEditMap && <button onClick={sendPost} type="submit">
                    Post
                </button>}
                </div>
              </div>

            </form>


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
                  <br />
                  {/* <img src={inputImg} alt="Preview" className="previewImage" /> */}
                  <div className="photoEditor">
                    {/* Div in which to view the photo. */}
                    <img src={inputImg}
                      className="previewImage" id="img" alt="Preview" style={getImageStyle()}></img>

                    {/* {console.log(getImageStyle())} */}
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
              {loading &&
                <div>
                  <Spinner animation="border" role="status">
                  </Spinner>
                  <span>{'  '}Scanning Image...</span>
                </div>}
              {(!loading) &&
                <div className="buttons">
                  <button onClick={editingDone}>Done</button>
                  <button onClick={editingCancelled}>Cancel</button>
                </div>}

            </Modal.Body>
          </Modal>
          {sliderImages && <ImageGallery sliderImages={sliderImages} />}
        </div>
      }
      {showEditMap &&
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
      <Modal
        show={cameraActive}
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

      <FlipMove>
        {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
        {posts.map( // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
          ({
            id,
            data: { name, description, message, photoUrl, largeGifs, comments, channelBy, hasCoordinates, lat, lng, stars, totalStars },
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
            />

          )
        )}
      </FlipMove>
    </div>
  );
}

export default Feed;
