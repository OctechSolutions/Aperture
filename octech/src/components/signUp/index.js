/* Inspired from YouTube video 
   "Firebase React Authentication Tutorial For Beginners - Private Route With Hooks"
   uploaded on May 5, 2019 by "Maksim Ivanov" */

import React, { useState } from 'react';
import { auth } from '../../firebase';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.css'
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
    }
}));

const SignUp = () => {

    const classes = useStyles();
    const [profilePicEvent, setProfilePicEvent] = useState(null)
    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showConsentForm, setShowConsentForm] = useState(false)
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch(); // Keep track of changes on the user slice

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
                                    profilePoints:0,
                                    blocked:[],
                                    blockedBy: [],
                                    collections :[]
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

    return (
        <>

            <div className="signUp" style={{ display: "flex", flexDirection: "column" }} >
                {/* Profile Picture */}
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ margin: "0% auto" }}>
                        <label htmlFor="fileUpload">
                            <div style={{ cursor: "pointer" }}>
                                <Avatar
                                    src={profilePic}
                                    className={classes.large}
                                >
                                    {!profilePic && <EditIcon className={classes.medium} />}
                                </Avatar>
                            </div>
                        </label>
                        <input 
                            hidden 
                            id="fileUpload" 
                            type="file" 
                            accept="image/*" 
                            onClick={() => setShowConsentForm(true)}
                            onChange={(e) => {
                                setProfilePicEvent(e)
                            }} 
                        />
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
                    style={{marginTop: "10px"}}
                >
                    <b>Sign Up</b>
                </Button>
            </div>
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
                closeFun={() => {setShowConsentForm(false)}}
                onBtnClickFun={() => {handleUpload(profilePicEvent)}}
            />
        </>
    )
}

export default SignUp
