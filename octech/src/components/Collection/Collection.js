import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from 'react-bootstrap/Modal';
import Divider from '@material-ui/core/Divider';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../firebase';
import firebase from "firebase";
import Fab from '@material-ui/core/Fab';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import '../Body/Post/Post.css'
import ImageGallery from '../../components/Body/Feed/ImageGallery';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { red } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';



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
    icon: {
        color: red[400],
    },
}));

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({}))(MenuItem);

const Compress = require('compress.js');


function Collection({ match, user }) {
    const [theme] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [sliderImages, setSliderImages] = useState([]);
    // const [images, setImages] = useState([]);
    const [CollectionExists, setCollectionExists] = useState(false);
    //const [Collection, setCollection] = useState([]);
    const [Collections, setCollections] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        db.collection("collections").where("creator", "==", match.params.id).onSnapshot((snapshot) => {
            if (!snapshot.docs.length) {
                setCollectionExists(false);
            }
            else {
                setCollectionExists(true);

                setCollections(
                    snapshot.docs.map((doc) => {
                        let imgs = []
                        doc.data().imageRef.forEach((id) => {
                            db.collection("postImages").doc(id).get().then((doc) => {
                                if (doc.exists) {
                                    imgs.push(doc.data().url);
                                }
                            });
                        })
                        return ({
                            id: doc.id,
                            key: doc.id,
                            data: doc.data(),
                            images: imgs, // To store the images that we added to the collection from already uploaded post
                        })
                    }
                    )
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
        setSliderImages([])
    }
    const classes = useStyles();
    const getImg = (test) => {
        const tempImages = []
        test.forEach((a) => {
            tempImages.push({ src: a })
        })
        return tempImages;
    }

    const [index, setIndex] = useState(null)

    return (
        <div style={{ marginBottom: "100px" }}>
            {
                !open && CollectionExists &&

                <div>
                    <div>
                        <br />
                        <center>
                            <Button
                                aria-controls="customized-menu"
                                aria-haspopup="true"
                                variant="contained"
                                color="primary"
                                onClick={handleClick}
                                endIcon={<ArrowDropDownIcon />}
                            >
                                <b>Select Collection</b>
                            </Button>
                        </center>
                        <StyledMenu
                            id="customized-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {
                                Collections.map(
                                    //  The posts from the useEffect hook that were saved are 
                                    //  iterated over and a new Post component is created corresponding to the posts it is iterating over

                                    ({
                                        id,
                                        data,
                                        images
                                    }, i) => (
                                        <StyledMenuItem onClick={() => { setAnchorEl(null); setIndex(i) }}>
                                            <ListItemIcon>
                                                <PermMediaIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary={data.name} />
                                        </StyledMenuItem>
                                    ))}
                        </StyledMenu>
                    </div>
                    <br />

                </div>
            }
            {
                (match.params.id === user.displayName) && !CollectionExists &&
                <center style={{ marginTop: "15vh" }}>
                    <p>Ready to Create the Perfect Collection?</p>
                    <Button variant="contained"
                        color="primary" onClick={() => { setOpen(true) }}><b>Build a Collection</b></Button>
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
                        {/* <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="A theme by you!"
                            onChange={(e) => settheme(e.target.value)}
                        /> */}

                        {/* Description Input */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="A Short Description..."
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
                                    <b>Choose Your Fondest Memories</b>
                                </Button>
                            </label>
                        </div>

                        <center style={{ fontSize: "12px" }}>(Upload your memories)</center>

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

            
            {Collections[index] !== undefined && index !== null &&
                <div style={{ margin: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "15px" }}>
                        <div>
                            <Typography variant="caption" display="block" >
                                Collection Name :
                            </Typography>
                            <b>{Collections[index].data.name}</b>
                        </div>
                        <IconButton aria-label={`delete ${Collections[index].data.name}`} className={classes.icon}>
                            {(match.params.id === user.displayName) && <DeleteIcon onClick={() => {
                                db.collection("collections").doc(Collections[index].id).delete();
                                db.collection("users").doc(user.displayName).update({
                                    collections: firebase.firestore.FieldValue.arrayRemove(Collections[index].data.name)
                                });
                                Collections.splice(index, 1)
                            }} />}
                        </IconButton>
                    </div>

                    {[...Collections[index].data.images, ...Collections[index].images] && [...Collections[index].data.images, ...Collections[index].images].length > 0 && <ImageGallery sliderImages={getImg([...Collections[index].data.images, ...Collections[index].images])} />}
                    <center style={{marginTop: "-10px"}}>
                        <Typography variant="caption" display="block" >
                            {Collections[index].data.description}
                        </Typography>
                    </center>
                    <br />
                </div>}
            {
                (match.params.id === user.displayName) && CollectionExists &&
                <center style={{ marginLeft: "-55px" }}>
                    <Fab className={classes.fab} color='primary' onClick={() => { setOpen(true) }}>
                        <AddPhotoAlternateIcon />
                    </Fab>
                </center>
            }
        </div >
    )
}

export default Collection
