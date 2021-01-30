<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import { db, auth } from "../../../firebase"
import Modal from 'react-bootstrap/Modal'
import CreatePortfolioInfo from './create_portfolio_info/createPorfolioInfo'
import './Portfolio.css'
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import PortfolioDisplay from './portfolio_display/PortfolioDisplay'

export default function Portfolio() {
    const portfolioDocRef = db.collection("portfolios").doc(auth.currentUser.uid)

    const [hasPortfolio, setHasPortfolio] = useState(false)
    const [showCreatePortfolio, setShowCreatePortfolio] = useState(false)

    /* Method that will set the value of state hasPortfolio to 
       true if the current user alredy has a portfolio and 
       will set it to false otherwise. */
    const checkIfPortfolioExists = async () => {
        portfolioDocRef.get().then(function(doc) {
            if (doc.exists) {
                if(!hasPortfolio) { setHasPortfolio(true) }
            } else {
                // doc.data() will be undefined in this case
                console.log("No Portfolio!")
                if(hasPortfolio) { setHasPortfolio(false) }
            }
        }).catch(function(error) {
            console.log("Error getting document:", error)
        })
    }

    /* Method that will delete the created portfolio. */
    const deletePortfolio = async () => {
        portfolioDocRef.delete().then(function() {
            console.log("Portfolio successfully deleted!")
        }).catch(function(error) {
            console.error("Error removing portfolio: ", error)
        })
        setHasPortfolio(false)
    }

    useEffect(() => { checkIfPortfolioExists() }, [hasPortfolio])

    /* If the user has a portfolio, then display it and enable him/her
       to edit it. If the user does not have a portfolio, then 
       promt him to make one. */
    if(hasPortfolio) {
        return (
            <div className="portfolio">
                <PortfolioDisplay /><br />
                <button 
                    className="edit-portfolio-btn btn btn-dark"
                    onClick={deletePortfolio}
                >
                    Delete Portfolio
                </button>
            </div>
        )
    } else {
        return (
            <div className="portfolio">
                <p>Looks like you're still on the hunt for the perfect portfolio!</p>
                <button 
                    className="create-portfolio-btn btn btn-dark"
                    onClick={() => {setShowCreatePortfolio(true)}}
                >
                    I'm Ready! Lets Make One Now!
                </button>
                <Modal
                    show={showCreatePortfolio}
                    keyboard={false}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header 
                        closeButton 
                        onClick={() => { setShowCreatePortfolio(false) }}
                    >
                        {/* Portfolio Creation Heading */}
                        <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}>
                            {auth.currentUser.displayName}, Kindly Let the World Know ...
                        </h4>
                    </Modal.Header>
                    
                    <Modal.Body>
                        <CreatePortfolioInfo 
                            set_show_create_portfolio={setShowCreatePortfolio}
                            set_has_portfolio={setHasPortfolio}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
=======
import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Modal from 'react-bootstrap/Modal';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Divider from '@material-ui/core/Divider';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../../firebase';
import firebase from "firebase";


const Compress = require('compress.js');
const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    medium: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    }
}));

function Portfolio({ match, user }) {
    const classes = useStyles();
    const [profilePic, setProfilePic] = useState("");
    const [quote, setQuote] = useState("");
    const [description, setDescription] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [open, setOpen] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);
    const [images, setImages] = useState([]);
    const [portfolioExists, setPortfolioExists] = useState(false);
    const [portfolio, setPortfolio] = useState([]);

    useEffect(() => {
        db.collection("portfolios").doc(match.params.id).onSnapshot((doc) => {
            console.log(doc.data())
            if (!doc.data()) {
                setPortfolioExists(false);
            }
            else {
                setPortfolioExists(true);
                setPortfolio(doc.data());
                const tempImages = [];
                doc.data().imageRef.forEach((id) => {
                    db.collection("postImages").doc(id).get().then((doc) => {
                        tempImages.push(doc.data().url);
                    });
                })
                setImages(tempImages);
            }
        })

    }, [match.params.id]);


    const handleUpload = async (e) => { // When a file is uploaded this function is called
        e.preventDefault();
        const compress = new Compress();
        compress.compress([e.target.files[0]], {
            size: 0.8, // the max size in MB, defaults to 2MB
            quality: .50, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
        }).then((data) => {
            // returns an array of compressed images
            console.log(data);
            var compressedb64 = data[0].prefix + data[0].data;
            setProfilePic(compressedb64)
        })

    }

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

    const createPortfolio = () => {
        db.collection("portfolios").doc(user.displayName).set({
            headshot: profilePic,
            quote: quote,
            description: description,
            firstName: firstName,
            lastName: lastName,
            images: [],
            imageRef: []
        });

        sliderImages.map((a) =>
            db.collection("portfolios").doc(user.displayName).update({
                images: firebase.firestore.FieldValue.arrayUnion(a)
            })
        )

        setOpen(false)
    }


    const deletePortfolio = () => {
        db.collection("portfolios").doc(user.displayName).delete();
    }

    return (
        <>
            {
                (match.params.id === user.displayName) && (!portfolioExists) &&
                <center style={{ margin: "26vh 0", padding: "20px" }}>
                    <p>Looks like you're still on the hunt for the perfect portfolio!</p>
                    <Button variant="contained"
                        color="primary" onClick={() => { setOpen(true) }}><b>I'm Ready! Lets Make One Now!</b></Button>
                </center>
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
                    <div className="createPortfolio" style={{ display: "flex", flexDirection: "column" }} >
                        {/* Portfolio Picture */}

                        <div style={{ margin: "5% auto" }}>
                            <div>
                                <Avatar
                                    src={profilePic}
                                    className={classes.large}>
                                </Avatar>
                            </div>
                        </div>

                        <div style={{ margin: "0 auto" }}>
                            <input accept="image/*" id="icon-button-file" type="file" style={{ display: "none" }} onChange={handleUpload} />
                            <label htmlFor="icon-button-file">
                                <Button variant="contained" color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                    <Divider orientation="vertical" />
                                    <Divider orientation="vertical" />
                                    <Divider orientation="vertical" />
                                    <b>Headshot</b>
                                </Button>
                            </label>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                label="First Name"
                                fullWidth
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <div style={{ width: "20px" }} />
                            <TextField
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                label="Last Name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* Quote Input */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="A quote by you!"
                            onChange={(e) => setQuote(e.target.value)}
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
                            onClick={createPortfolio}
                            style={{ marginTop: "10px" }}
                        >
                            <b>Create Portfolio!</b>
                        </Button>
                    </div>
                </div>
            </Modal>

            {portfolioExists &&
                <>
                    <p>{portfolio.description}</p>
                    <p>{portfolio.quote} - {match.params.id}</p>
                    <Avatar src={portfolio.headshot} />
                </>
            }
            {
                portfolioExists && portfolio.images &&

                <div style={{ width: "80vw", margin: "0 auto" }}>

                    <div>
                        <Carousel
                            interval={null}
                            controls={((portfolio.images.length + images.length) > 1) ? true : false}
                        >
                            {portfolio.images.map((a) =>

                                <Carousel.Item className="post__image">
                                    <img
                                        src={a}
                                        alt="Carousel"
                                    />
                                </Carousel.Item>
                            )}

                            {images.map((a) =>

                                <Carousel.Item className="post__image">
                                    <img
                                        src={a}
                                        alt="Carousel"
                                    />
                                </Carousel.Item>
                            )}

                        </Carousel>
                    </div>
                </div>
            }
            {(match.params.id === user.displayName) && (portfolioExists) &&
                <>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={deletePortfolio}
                        style={{ marginTop: "10px" }}
                    >
                        <b>Delete Portfolio</b>
                    </Button>
                </>
            }
        </>
    )
>>>>>>> 85cf18c86e21cabc76af58190a271270db1ebae7
}

