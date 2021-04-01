import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Login from './components/Login/Login';
import { login, logout, selectUser } from './features/userSlice';
import { auth } from './firebase';
import { db } from "./firebase";
import { BrowserRouter as Router } from 'react-router-dom';
import NewsfeedPage from './pages/NewsFeedPage'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Modal from 'react-bootstrap/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


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

function App() {
  const user = useSelector(selectUser); // Select the currently logged in user from the slice using redux
  const dispatch = useDispatch(); // Keep track of changes on the user slice
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)
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
  var accessories = ["Blank", "Kurt", "Prescription01", "Prescription02", "Round", "Sunglasses", "Wayfarers"]
  var hair = ["Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink", "Platinum", "Red", "SilverGray"]
  var fHairColor = ["Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "Platinum", "Red"]
  var facialHair = ["Blank", "BeardMedium", "BeardLight", "BeardMajestic", "MoustacheFancy", "MoustacheMagnum"]
  var clothe = ["BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie", "Overall", "ShirtCrewNeck", "ShirtScoopNeck", "ShirtVNeck"]
  var eye = ["Close", "Cry", "Default", "Dizzy", "EyeRoll", "Happy", "Hearts", "Side", "Squint", "Surprised", "Wink", "WinkWacky"]
  var eyeBrow = ["Angry", "AngryNatural", "Default", "DefaultNatural", "FlatNatural", "RaisedExcited", "RaisedExcitedNatural", "SadConcerned", "SadConcernedNatural", "UnibrowNatural", "UpDown", "UpDownNatural"]
  var mouth = ["Concerned", "Default", "Disbelief", "Eating", "Grimace", "Sad", "ScreamOpen", "Serious", "Smile", "Tongue", "Twinkle", "Vomit"]
  var skin = ["Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black"]
  var style = ["Circle", "Default"]

  // User must verify his/her email.
  const sendVerificationEmail = (curUser) => {
    curUser.sendEmailVerification().then(function () {
    }
    ).catch(function (error) {
      alert("Error : " + error)
    })

  }


  const classes = useStyles();

  useEffect(() => { // useEffect keeps listening to the variables passed in the array at the end
    auth.onAuthStateChanged(userAuth => { // When the state of the user changes this function is called that is if the user logs in or out this function gets called
      if (userAuth) { // If user logs in, userAuth becomes true as it holds some value
        db.collection("users").where("email", "==", userAuth.email).get().then((querySnapshot) => { //This is a firebase query to get all users in the db with the name of the current user
          if (querySnapshot.size === 0) { // If there is none in the db, it means its the first time the user is logging in and he is added to the db
            // This if condition will only be true when the user logs in for the first time
            if (userAuth.displayName) {
              db.collection("users").doc(userAuth.displayName).set({
                name: userAuth.displayName,
                email: userAuth.email,
                photoUrl: userAuth.photoURL,
                friends: [],
                friendRequestReceived: [],
                friendRequestSent: [],
                followingChannels: [],
                profilePoints: 0,
                blocked: [],
                blockedBy: [],
                league: "No league profile points less than 100",
                collections: []
              });
            }
            // sendVerificationEmail(userAuth)
            if (userAuth.providerData[0].providerId === "google.com") {
              setShowAvatarEditor(true)
            }
            else {
              sendVerificationEmail(userAuth)
            }

          }
          else {
            // If already in db do nothing
          }
        })
        //The dispatch function sets the user in the redux slice so that we know which user is logged in, all this info is stored in the login state
        dispatch(login({
          email: userAuth.email,
          uid: userAuth.uid,
          displayName: userAuth.displayName,
          photoUrl: userAuth.photoURL,
          emailVerified: userAuth.emailVerified
        }))
      } else {
        // This else part evaluates true when the userAuth is null i.e. the user has logged out
        dispatch(logout()); // Simply calls the logout state in the slice
      }
    })
  }, [dispatch]); // dispatch is the variable which is always listened to by the use effect which means it only executes when there is a change in dispatch

  return (
    /* BrowserRouter (renamed to router) is used to route the user to different pages in our app everything wrapped under it can use the router functions */
    <Router>
      {
        !user ? // This is basically an if condition (ternary operator) which checks if the user exists (this user variable is fetched using useSelector which is a redux function to get the user if he is logged in)
          (<Login />) : // The login component is called whenever the user attribute in the slice is false i.e. when the user is logged out
          (
            // When the user is logged in the following code is executed
            <>
              <NewsfeedPage
                isVerified={user.emailVerified}
              />
              <Modal
                show={showAvatarEditor}
                keyboard={false}
                size="s"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable={true}
              >
                <Modal.Header>
                  <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                    <h4 style={{ marginLeft: "auto", marginRight: "auto" }}>Create an Avatar!</h4>
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
                  <Button onClick={() => {
                    auth.currentUser.updateProfile({
                      photoURL: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`
                    }).then(() => {
                      db.collection("users").doc(user.displayName).set({
                        photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`,
                      }, { merge: true }); dispatch(login({
                        email: auth.currentUser.email,
                        uid: auth.currentUser.uid,
                        displayName: auth.currentUser.displayName,
                        photoUrl: auth.currentUser.photoURL,
                        emailVerified: auth.currentUser.emailVerified
                      })); setShowAvatarEditor(false)
                    })
                  }}>
                    Done
                    </Button>
                  <Button onClick={() => {
                    auth.currentUser.updateProfile({
                      photoURL: ``
                    }).then(() => {
                      db.collection("users").doc(user.displayName).set({
                        photoUrl: ``,
                      }, { merge: true }); dispatch(login({
                        email: auth.currentUser.email,
                        uid: auth.currentUser.uid,
                        displayName: auth.currentUser.displayName,
                        photoUrl: auth.currentUser.photoURL,
                        emailVerified: auth.currentUser.emailVerified
                      })); setShowAvatarEditor(false)
                    })
                  }}>Cancel</Button>
                </Modal.Footer>
              </Modal>
            </>
          )
      }
    </Router>
  );
}

export default App;
