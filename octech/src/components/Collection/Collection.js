import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Modal from 'react-bootstrap/Modal';
import Divider from '@material-ui/core/Divider';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../firebase';
import firebase from "firebase";
import { SettingsInputSvideoRounded } from '@material-ui/icons';


const Compress = require('compress.js');


function Collection({ match, user }) {

    const [theme, settheme] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);
    const [images, setImages] = useState([]);
    const [CollectionExists, setCollectionExists] = useState(false);
    const [Collection, setCollection] = useState([]);
    const [Collections, setCollections] = useState([]);

    useEffect(() => {
        db.collection("collections").where("creator", "==", match.params.id).onSnapshot((snapshot) => {
            if (!snapshot.docs.length) {
                setCollectionExists(false);
            }
            else {
                setCollectionExists(true);

                setCollections(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        key: doc.id,
                        data: doc.data(),
                    }))
                )
            }
        })

    }, [match.params.id]);

    const handleImagesUpload = async (e) => { // When a file is uploaded this function is called
        e.preventDefault();
        const compress = new Compress();
        compress.compress([...e.target.files], {
            size: 0.8, // the max size in MB, defaults to 2MB
            quality: .50, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
        }).then((data) => {
            // returns an array of compressed images
            // console.log(data);
            const temp = [];
            data.forEach((a) => {
                var compressedb64 = a.prefix + a.data;
                temp.push(compressedb64);
            })
            console.log(temp)
            setSliderImages(sliderImages.concat(temp));
            // setProfilePic(compressedb64)
        })

    }

    const createCollection = () => {
        const collectionRef = db.collection("collections").doc(user.displayName + name);
        collectionRef.set({
            creator: user.displayName,
            name: name,
            theme: theme,
            description: description,
            images: [],
            imageRef: []
        });

        sliderImages.map((a) =>
            db.collection("collections").doc(collectionRef.id).update({
                images: firebase.firestore.FieldValue.arrayUnion(a)
            })
        )

        db.collection("users").doc(user.displayName).update({
            collections: firebase.firestore.FieldValue.arrayUnion(name)
        });

        setOpen(false)
    }


    return (
        <>
            {
                (match.params.id === user.displayName) &&
                <div style={{ padding: "20px" }}>
                    <p>Looks like you're still on the hunt for the perfect Collection!</p>
                    <Button variant="contained"
                        color="primary" onClick={() => { setOpen(true) }}><b>I'm Ready! Lets Make One Now!</b></Button>
                </div>
            }
            <Modal
                show={open}
                onHide={() => { setOpen(false) }}
                size="l"
                aria-labelledby="contained-modal-title-vcenter"
                scrollable={true}
                centered
            >
                <div style={{ padding: "10px" }}>
                    <div className="createCollection" style={{ display: "flex", flexDirection: "column" }} >

                        {/* Name Input */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Name Your Collection!"
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* theme Input */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="A theme by you!"
                            onChange={(e) => settheme(e.target.value)}
                        />

                        {/* Description Input */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Who are you? (A Short Description)"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div style={{ margin: "0 auto" }}>
                            <input required
                                multiple
                                name="bestWork"
                                id="bestWork"
                                type="file"
                                accept="image/*" style={{ display: "none" }} onChange={handleImagesUpload} />
                            <label htmlFor="bestWork">
                                <Button variant="contained" color="primary" aria-label="upload picture" component="span">
                                    <AddPhotoAlternateIcon />
                                    <Divider orientation="vertical" />
                                    <Divider orientation="vertical" />
                                    <Divider orientation="vertical" />
                                    <b>Upload Images</b>
                                </Button>
                            </label>
                        </div>

                        <center style={{ fontSize: "12px" }}>(Upload Images that showcase your Photography at its Best!)</center>

                        <Carousel
                            interval={null}
                            controls={(sliderImages.length > 1) ? true : false}
                            style={{ margin: "auto" }}
                        >
                            {sliderImages.map((a) =>

                                <Carousel.Item >
                                    <img
                                        style={{ height: "25vh", width: "auto" }}
                                        src={a}
                                        alt="Carousel"
                                    />
                                </Carousel.Item>
                            )}

                        </Carousel>

                        {/* Submit Button Input */}
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={createCollection}
                            style={{ marginTop: "10px" }}
                        >
                            <b>Create Collection!</b>
                        </Button>
                    </div>
                </div>
            </Modal>

            {
                CollectionExists &&

                <div>
                    {
                        Collections.map( // The posts from the useEffect hook that were saved are iterated over and a new Post component is created corresponding to the posts it is iterating over
                            ({
                                id,
                                data
                            }) => (

                                <div>
                                    {console.log(data)}

                                    <p>Name - {data.name}</p>
                                    <p>Theme - {data.theme} [{data.description}]</p>
                                    <Carousel
                                        interval={null}
                                        controls={((data.images.length) > 1) ? true : false}
                                    >
                                        {data.images.map((a) =>

                                            <Carousel.Item className="post__image">
                                                <img
                                                    src={a}
                                                    alt="Carousel"
                                                />
                                            </Carousel.Item>
                                        )}

                                        {/* {images.map((a) =>

                                            <Carousel.Item className="post__image">
                                                <img
                                                    src={a}
                                                    alt="Carousel"
                                                />
                                            </Carousel.Item>
                                        )} */}

                                    </Carousel>
                                    {(match.params.id === user.displayName) &&
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                db.collection("collections").doc(id).delete();
                                                db.collection("users").doc(user.displayName).update({
                                                    collections: firebase.firestore.FieldValue.arrayRemove(data.name)
                                                });
                                            }}
                                            style={{ marginTop: "10px" }}>

                                            <b>Delete Collection</b>

                                        </Button>}
                                </div>

                            )
                        )
                    }

                </div>
            }
        </>
    )
}

export default Collection
