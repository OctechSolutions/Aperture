/* Inspired from YouTube video 
   "Firebase React Authentication Tutorial For Beginners - Private Route With Hooks"
   uploaded on May 5, 2019 by "Maksim Ivanov" */

import React, { useState } from 'react';
import { auth } from '../../firebase';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './signUp.css'
import EditIcon from '@material-ui/icons/Edit';
import { storage, db } from '../../firebase';
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { InputAdornment } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ConsentForm from '../ConsentForm/ConsentForm'
import Modal from 'react-bootstrap/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    medium: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    xl: {
        width: theme.spacing(30),
        height: theme.spacing(30),
    },
}));

const SignUp = () => {

    const classes = useStyles();
    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicConsent, setProfilePicConsent] = useState(true);
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showConsentForm, setShowConsentForm] = useState(false)
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch(); // Keep track of changes on the user slice
    const [showAvatarEditor, setShowAvatarEditor] = useState(false)

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const handleUpload = async (e) => { // When a file is uploaded this function is called
        e.preventDefault();
        var reader = new FileReader();

        if (e.target.files[0] !== undefined) {
            reader.readAsDataURL(e.target.files[0]); // The image file is converted to its base64 equivalent string and is stored in reader as reader.result
            setFile(e.target.files[0])
        }
        reader.onloadend = function () { // Since this is asyncronous on completion of the loading the image is set with the base64 string
            console.log("RESULT", reader.result);
            setProfilePic(reader.result);
            // alert("Image Uploaded Sucessfully!")
        };
    }

    // handleSubmit = What to do when the sign up form is submitted?
    const handleSubmit = (async event => {
        event.preventDefault() // Prevent default behavior of re-loading etc.

        const updateUserProfile = async () => {
            if (name && username && email && password) {

                await auth // Wait until the user has been added to authenticated users list in Firebase.
                    .createUserWithEmailAndPassword(email, confirmPassword)
                if (file !== undefined) {
                    const storageRef = storage.ref();
                    const fileRef = storageRef.child(file.name);
                    fileRef.put(file).then(() => {
                        fileRef.getDownloadURL().then((doc) => {
                            auth.currentUser.updateProfile({
                                displayName: username,
                                photoURL: doc
                            }).then(() => {
                                console.log(auth.currentUser)
                                db.collection("users").doc(username).set({
                                    name: username,
                                    email: email,
                                    photoUrl: doc,
                                    realName: name,
                                    contactNumber: contactNumber,
                                    friends: [],
                                    friendRequestReceived: [],
                                    friendRequestSent: [],
                                    followingChannels: [],
                                    profilePoints: 0,
                                    blocked: [],
                                    blockedBy: [],
                                    league: "No league profile points less than 100",
                                    collections: []
                                }, { merge: true });
                                dispatch(login({
                                    email: email,
                                    displayName: username,
                                    photoUrl: doc
                                }))
                            })
                        })
                    })

                } else {
                    return auth.currentUser.updateProfile({
                        displayName: username
                    }).then(() => {
                        dispatch(login({
                            email: email,
                            displayName: username,
                        }))
                    })
                }
            }
            else {
                setError("Please fill in the required fields");
                setOpen(true)
            }
        }

        async function doesUsernameExists() {
            let toReturn = false
            await db.collection("users").where("name", "==", username)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        if (doc.data()) {
                            // doc.data() is never undefined for query doc snapshots
                            toReturn = true
                        }
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
            return toReturn
        }

        if (confirmPassword === password) {
            let usernameExists = false

            await doesUsernameExists().then((res) => {
                console.log(res)
                usernameExists = res
            })

            if (usernameExists) {
                setError("Sorry. This username already exists.");
                setOpen(true);
            } else {
                try {
                    await updateUserProfile()
                } catch (error) {
                    setError(error.message);
                    console.log(error);
                    setOpen(true);
                }
            }
        } else {
            setError("The password and the confirmed password must match.");
            setOpen(true);
        }
    })

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const [avatarStyle, setAvatarStyle] = useState("Circle")
    const [accessoriesType, setAccessoriesType] = useState("Blank")
    const [clotheType, setClotheType] = useState("BlazerShirt")
    const [eyeType, setEyeType] = useState("Default")
    const [eyebrowType, setEyebrowType] = useState("Default")
    const [facialHairColor, setFacialHairColor] = useState("Brown")
    const [facialHairType, setFacialHairType] = useState("BeardLight")
    const [hairColor, setHairColor] = useState("Brown")
    const [mouthType, setMouthType] = useState("Smile")
    const [skinColor, setSkinColor] = useState("Light")
    const [topType, setTopType] = useState("ShortHairShortWaved")

    
    var top = ["NoHair", "Eyepatch", "Hat", "Hijab", "Turban", "WinterHat1", "WinterHat2", "WinterHat3", "WinterHat4", "LongHairBigHair", "LongHairBob", "LongHairBun", "LongHairCurly", "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro", "LongHairFroBand", "LongHairNotTooLong", "LongHairShavedSides", "LongHairMiaWallace", "LongHairStraight", "LongHairStraight2", "LongHairStraightStrand", "ShortHairDreads01", "ShortHairDreads02", "ShortHairFrizzle", "ShortHairShaggyMullet", "ShortHairShortCurly", "ShortHairShortFlat", "ShortHairShortRound", "ShortHairShortWaved", "ShortHairSides", "ShortHairTheCaesar", "ShortHairTheCaesarSidePart"];
    var accessories = ["Blank","Kurt","Prescription01","Prescription02","Round","Sunglasses","Wayfarers"]
    var hair = ["Auburn","Black","Blonde","BlondeGolden","Brown","BrownDark","PastelPink","Platinum","Red","SilverGray"]
    var fHairColor = ["Auburn","Black","Blonde","BlondeGolden","Brown","BrownDark","Platinum","Red"]
    var facialHair = ["Blank","BeardMedium","BeardLight","BeardMajestic","MoustacheFancy","MoustacheMagnum"]
    var clothe = ["BlazerShirt","BlazerSweater","CollarSweater","GraphicShirt","Hoodie","Overall","ShirtCrewNeck","ShirtScoopNeck","ShirtVNeck"]
    var eye = ["Close","Cry","Default","Dizzy","EyeRoll","Happy","Hearts","Side","Squint","Surprised","Wink","WinkWacky"]
    var eyeBrow = ["Angry","AngryNatural","Default","DefaultNatural","FlatNatural","RaisedExcited","RaisedExcitedNatural","SadConcerned","SadConcernedNatural","UnibrowNatural","UpDown","UpDownNatural"]
    var mouth = ["Concerned","Default","Disbelief","Eating","Grimace","Sad","ScreamOpen","Serious","Smile","Tongue","Twinkle","Vomit"]
    var skin = ["Tanned","Yellow","Pale","Light","Brown","DarkBrown","Black"]
    var style = ["Circle","Default"]

    return (
        <>

            {!showAvatarEditor && <div className="signUp" style={{ display: "flex", flexDirection: "column" }} >
                {/* Profile Picture */}
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ margin: "0% auto" }}>
                        {/* <label htmlFor="fileUpload"> */}
                        <div style={{ cursor: "pointer" }}>
                            <Avatar
                                src={profilePic}
                                className={classes.large}
                                onClick={() => {
                                    setShowAvatarEditor(true);
                                }}
                            >
                                {!profilePic && <EditIcon className={classes.medium} />}
                            </Avatar>
                        </div>
                        {/* </label> */}
                        {/* {
                                profilePicConsent && 
                                <input 
                                    hidden 
                                    id="fileUpload" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleUpload} 
                                />
                           } */}
                    </div>
                </div>

                {/* Name Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Username Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    onChange={(e) => setUsername(e.target.value)}
                />

                {/* Email Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="filled-adornment-password"
                    InputProps=
                    {{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>

                    }}

                    labelWidth={60}
                    // autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}

                />

                {/* Password Confirmation Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="filled-adornment-confirm-password"
                    InputProps=
                    {{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>

                    }}

                    labelWidth={60}
                    // autoComplete="current-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}

                />

                {/* Contact Number Input */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="contactNumber"
                    label="Contact Number"
                    name="contactNumber"
                    autoComplete="contactNumber"
                    autoFocus
                    onChange={(e) => setContactNumber(e.target.value)}
                />

                {/* Submit Button Input */}
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    style={{ marginTop: "10px" }}
                >
                    <b>Sign Up</b>
                </Button>
            </div>}
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <ConsentForm
                show={showConsentForm}
                heading={"Dear User,"}
                message={"We at Aperture would like to inform you that if you choose to upload an image of yourself as your profile picture, it will be stored in our db. Please comply to continue."}
                btnLabel={"You Have My Consent"}
                closeFun={() => { setShowConsentForm(false) }}
                onBtnClickFun={() => { setProfilePicConsent(true) }}
            />
            <Modal
                show={showAvatarEditor}
                keyboard={false}
                size="s"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable={true}
            >
                <Modal.Header closeButton onClick={() => { setShowAvatarEditor(false) }}>
                    <div style={{ marginLeft: "auto", marginRight: "-25px" }}>
                        <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}>Create an Avatar!</h4>
                        <center>
                            <Avatar
                                src={`https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`}
                                className={classes.xl}
                            />
                        </center>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <center>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={topType}
                                onChange={(e) => { setTopType(e.target.value) }}
                            >
                                {
                                    top.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Top Type</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={accessoriesType}
                                onChange={(e) => { setAccessoriesType(e.target.value) }}
                            >
                                {
                                    accessories.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Accessories Type</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={hairColor}
                                onChange={(e) => { setHairColor(e.target.value) }}
                            >
                                {
                                    hair.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Hair Color</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={facialHairType}
                                onChange={(e) => { setFacialHairType(e.target.value) }}
                            >
                                {
                                    facialHair.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Facial Hair Type</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={facialHairColor}
                                onChange={(e) => { setFacialHairColor(e.target.value) }}
                            >
                                {
                                    fHairColor.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Facial Hair Color</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={clotheType}
                                onChange={(e) => { setClotheType(e.target.value) }}
                            >
                                {
                                    clothe.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Clothe Type</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={eyeType}
                                onChange={(e) => { setEyeType(e.target.value) }}
                            >
                                {
                                    eye.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Eye Type</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={eyebrowType}
                                onChange={(e) => { setEyebrowType(e.target.value) }}
                            >
                                {
                                    eyeBrow.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Eyebrow Type</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={mouthType}
                                onChange={(e) => { setMouthType(e.target.value) }}
                            >
                                {
                                    mouth.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Mouth Type</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={skinColor}
                                onChange={(e) => { setSkinColor(e.target.value) }}
                            >
                                {
                                    skin.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Skin Color</FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "80%", padding: "10px" }}>
                            <Select
                                value={avatarStyle}
                                onChange={(e) => { setAvatarStyle(e.target.value) }}
                            >
                                {
                                    style.map((t) => {
                                        return <MenuItem value={t}>{t}</MenuItem>
                                    })
                                }
                            </Select>
                            <FormHelperText>Background Style</FormHelperText>
                        </FormControl>
                    </center>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick = {() => {setProfilePic(`https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`); setShowAvatarEditor(false)}}>
                        Done
                    </Button>
                    <Button onClick={() => {setProfilePic("");setShowAvatarEditor(false)}}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SignUp
