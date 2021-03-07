import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import Post from "../../Post/Post";
import { db } from "../../../../firebase";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/userSlice";
import FlipMove from "react-flip-move";
import ImageIcon from "@material-ui/icons/Image";
import "react-html5-camera-photo/build/css/index.css";
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import InputBase from '@material-ui/core/InputBase';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Menu from '@material-ui/core/Menu';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImageGallery from "../../Feed/ImageGallery";
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');

const Compress = require('compress.js');

const useStyles = makeStyles((theme) => ({
    fab: {
        top: 'auto',
        bottom: 45,
        position: 'fixed',
        zIndex: 100,
    },
    input: {
        marginLeft: theme.spacing(2),
        flex: 1,
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
function GamingForum({ match }, props) {
    const user = useSelector(selectUser);
    const [input, setInput] = useState("");
    const [, setFile] = useState(null)
    const [inputImg, setInputImg] = useState("");
    const [inputImgs, setInputImgs] = useState([]);
    const [posts, setPosts] = useState([]);
    const [editOptions, setEditOptions] = useState(DEFAULT_EDIT_OPTIONS);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const selectedOption = editOptions[selectedOptionIndex];
    const [sliderImages, setSliderImages] = useState([]);
    const [largeImages, setLargeImages] = useState([]);
    const [, setNohuman] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showEditMap,] = useState(false);
    const [isPrivatePost, setIsPrivatePost] = useState(false);
    const [showPostComponent, setShowPostComponent] = useState(false);

    const cocoSsd = require('@tensorflow-models/coco-ssd');

    const classes = useStyles();
    const [cropper, setCropper] = useState("");
    const [cropping, setCropping] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

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

    useEffect(() => { // This useEffect is called on the component mounting, it fetches all the posts from the db and stores them into the posts array
        db.collection("forumPosts")
            .where("type", "==", "gamingForum")
            .orderBy("timestamp", "desc") // Sorting by timestamp descending allows the new posts to be shown on top
            .onSnapshot((snapshot) => {
                setPosts(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    key: doc.id,
                    data: doc.data(),
                })))
            })


    }, []);

    const sendPost = async (e) => { // When the new post is submitted this function is called
        e.preventDefault(); // This is to prevent the default behaviour of submitting a form
        console.log(sliderImages);

        if (sliderImages.length) {

            const ref = db.collection('forumPosts').doc() // A reference to the next entry to the database is created in advance
            ref.set({ // This adds a new post to the databse
                name: user.displayName,
                description: user.email,
                message: input,
                photoUrl: user.photoUrl || "",
                largeGifs: largeImages,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                channelBy: "",
                hasCoordinates: false,
                stars: {},
                totalStars: 0,
                isPrivate: isPrivatePost,
                type: "gamingForum"
            })
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
        setIsPrivatePost(false);
        setShowPostComponent(false);
        setCropping("false");
    }

    const editingCancelled = async () => {
        setInputImg("");
        setEditOptions(DEFAULT_EDIT_OPTIONS);
        setIsPrivatePost(false);
    }

    const editingDone = async () => {
        setNohuman(false);

        if (inputImg) {
            setInputImgs(inputImgs.concat(inputImg))
            setSliderImages(sliderImages.concat({
                src: inputImg,
                style: getImageStyle()
            }))
            setInputImg("");
            setEditOptions(DEFAULT_EDIT_OPTIONS);
        }
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
        }
    };

    return (
        <>
            <br />
            <div className="feed">

                <center>
                    <h1>Gaming Forum</h1>
                </center>

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
                            {<>{`Let's go Gaming!`}</>}
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
                                    <InputBase
                                        className={classes.input}
                                        placeholder="What's on your mind?"
                                        inputProps={{ 'aria-label': 'caption' }}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)} // when the input is changed the input state variable is updated
                                    />

                                </form>
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
                                </>
                            }
                            {sliderImages && !showEditMap && <ImageGallery sliderImages={sliderImages} />}
                            {sliderImages.length > 0 &&

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

                <FlipMove>
                    {/* Flipmove is a library for the smooth animation that animated the new post being added to the DOM */}
                    {posts.map( // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
                        ({
                            id,
                            data: { name, description, message, photoUrl, largeGifs, comments, channelBy, hasCoordinates, lat, lng, stars, totalStars, isPrivate, timestamp, type },
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
                            >
                            </Post>
                        )
                    )}
                </FlipMove>
            </div>
            <center style={{ marginLeft: "-55px" }}>
                <Fab className={classes.fab} color='primary' onClick={() => { setShowPostComponent(true) }}>
                    <SportsEsportsIcon className={classes.extendedIcon} />
                </Fab>
            </center>
        </>
    );
}

export default GamingForum;
