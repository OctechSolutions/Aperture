import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux" // Related to routing.
import { selectUser } from "../features/userSlice" // Related to routing.
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import firebase from "firebase"
import { db } from "../firebase"
import Challenge from '../components/Challenge/Challenge'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    fab: {
      margin: 0,
      top: 'auto',
      right: 'auto',
      bottom: 45,
      left: 'auto',
      position: 'fixed',
      zIndex: 100
    }
  }));

export default function ChallengesPage() {
    const classes = useStyles();
    const user = useSelector(selectUser) // Related to routing.
    const userName = user.displayName // Name of current user.
    const alphaNumeric = /^[a-z0-9?!,.:;"' ]+$/i // Regular expression for input sanity check.

    const [challenges, setChallenges] = useState([])
    const [loadChallenges, setLoadChallenges] = useState(true)
    const [openForm, setOpenForm] = useState(false)
    const [publicSwitch, setPublicSwitch] = React.useState({ public: true, private: true, }) // For public/private switch toggle.
    const [challengeName, setChallengeName] = useState("")
    const [challengeDescription, setChallengeDescription] = useState("")
    const [challengeHint1, setChallengeHint1] = useState("")
    const [challengeHint2, setChallengeHint2] = useState("")
    const [challengeHint3, setChallengeHint3] = useState("")
    const [challengeIsPrivate, setChallengeIsPrivate] = useState(true)
    const [challengeStartDate, setChallengeStartDate] = useState(new Date())
    const [challengeEndDate, setChallengeEndDate] = useState(new Date())
    const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("")
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
    const [editChallenge, setEditChallenge] = useState(null)
    const [canCreateNewChallenge, setCanCreateNewChallenge] = useState(true)

    // Function for Snackbar.
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    // Function that calculates the start and end of current week.
    const checkCanCreateNewChallenge = () => {
        var todayDay = new Date().getDay()
        var start = new Date()
        var end = new Date()
        start.setDate(start.getDate() - todayDay)
        end.setDate(end.getDate() + (6 - todayDay))
        
        var numChallengesThisWeek = 0
        setCanCreateNewChallenge(true)

        // Query challenges collection to see if this user has created 3 challenges this week.
        db.collection("challenges").where("creator", "==", user.displayName).get()
        .then((docs) => {
            docs.forEach((doc) => { // Check if this user has created more than 3 challenges this week.
                if((doc.data().timestamp.toDate() >= start) && (doc.data().timestamp.toDate() <= end)) { numChallengesThisWeek += 1 }
                // If yes, then this user cannot create another challenge this week.
                if(numChallengesThisWeek >= 3) { 
                    setCanCreateNewChallenge(false) 
                }
            })
        })
    }

    // Function that loads all challenges
    const loadChallengeObjects = async () => {
        checkCanCreateNewChallenge()

        // Load challenges (once).
        if(loadChallenges) { // If challenges are to be loaded, then load them.
            setChallenges([]) // Set challenges to an empty array.

            db.collection('challenges').orderBy("timestamp", "desc").get() // Get challenges from db.
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    let data = doc.data() // data = a single challenge object.
                    let p = [{}]
                    if(data.participants!==undefined) {
                        p = data.participants
                    }
                    // Display only if ...
                    if( 
                        !data.isPrivate || // The challenge is not private.
                        data.creator === userName || // The user is the creator of the challenge.
                        p.map(u=>u.name).includes(userName) // The user is participating in this challenge.
                    ){ 
                        setChallenges((prevArr) => // Create a Challenge object and add to the list of challenges. 
                            [
                                ...prevArr, 
                                <Challenge
                                    key={doc.id}
                                    user={user}
                                    name={data.name}
                                    description={data.description}
                                    hints={data.hints} 
                                    creator={data.creator}
                                    creatorPhotoUrl={data.creatorPhotoUrl}
                                    isPrivate={data.isPrivate}
                                    code={data.code} 
                                    isAdmin={data.creator === userName} 
                                    leader={data.leader}
                                    startDate={data.startDate}
                                    endDate={data.endDate}
                                    ended = {data.ended}
                                    setLoadChallenges={setLoadChallenges}
                                    timestamp={data.timestamp}
                                    openEditForm={handleFormOpen}
                                    invitees={data.invitees}
                                    participants={data.participants?data.participants:{}}
                                > </Challenge>
                            ]
                        )
                    }
                })
            })
            setLoadChallenges(false)
        }
    }

    // Function that sets all state variables to default value.
    const resetFormValues = () => {
        setChallengeName("")
        setChallengeDescription("")
        setChallengeHint1("")
        setChallengeHint2("")
        setChallengeHint3("")
        setChallengeIsPrivate(true)
        setChallengeStartDate(new Date())
        setChallengeEndDate(new Date())
    }

    // Function that opens the input form to create a new challenge.
    const handleFormOpen = (editInfo) => {
        if(editInfo) { 
            setEditChallenge(editInfo) 
            
            setChallengeName(editInfo.name)
            setChallengeDescription(editInfo.description)
            setChallengeHint1(editInfo.hint1)
            setChallengeHint2(editInfo.hint2)
            setChallengeHint3(editInfo.hint3)
            setChallengeIsPrivate(editInfo.isPrivate)
            setChallengeStartDate(editInfo.startDate)
            setChallengeEndDate(editInfo.endDate)
        }
        setOpenForm(true);
    }

    // Function that closes the input form to create a new challenge.
    const handleFormClose = () => {
        setOpenForm(false)
        setEditChallenge(null)
        resetFormValues()      
    }

    // Function that submits the form to add a new challenge.
    const handleFormSubmit = () => {      
        if(canCreateNewChallenge) {

            // Check if selected start and end date are valid.
            if(challengeStartDate > challengeEndDate) {
                setSnackbarErrorMessage("Please select valid start and end dates.")
                setOpenErrorSnackbar(true)
            }
    
            // Check if challenge name entered is valid.
            else if(!alphaNumeric.test(challengeName)) {
                setSnackbarErrorMessage("Please enter a valid Challenge Title.")
                setOpenErrorSnackbar(true)
            }
    
            // Check if challenge description entered is valid.
            else if(!alphaNumeric.test(challengeDescription)){
                setSnackbarErrorMessage("Please enter a valid Challenge Description.")
                setOpenErrorSnackbar(true)
            }
    
            else {
                if(editChallenge !== null) { // IF FORM SUBMITTED TO EDIT A CHALLENGE.
                    // Delete the old version of this challenge.
                    db.collection("challenges").doc(editChallenge.name).delete()
                    .then(() => { // Replace with new version having the same old timestamp.
                        db.collection("challenges").doc(challengeName).get()
                        .then((challengeDoc) => {
                            if(challengeDoc.exists) {
                                setSnackbarErrorMessage("A challenge with this name already exists!")
                                setOpenErrorSnackbar(true)
                            }
                            else{
                                let newChallenge = {
                                    key: challengeDoc.id,
                                    creator: user.displayName,
                                    creatorPhotoUrl: user.photoUrl,
                                    description: challengeDescription,
                                    hints: [challengeHint1, challengeHint2,challengeHint3],
                                    invitees: editChallenge.invitees,
                                    participants: editChallenge.participants,
                                    isPrivate: challengeIsPrivate,
                                    name: challengeName,
                                    leader: "",
                                    startDate: challengeStartDate.toDateString(),
                                    endDate: challengeEndDate.toDateString(),
                                    timestamp: editChallenge.timestamp
                                }
                        
                                db.collection("challenges").doc(challengeName).set(newChallenge)
                                .then(() => {
                                    handleFormClose()
                                    setLoadChallenges(true)
                                })
                                .catch((error) => {
                                })
                            }
                        })
                    })
    
                    // If the name of this challenge has changed, then update it in all its challengePosts.
                    db.collection("challengePosts").where("challenge", "==", editChallenge.name).get()
                    .then((docs) => { docs.forEach((doc) => { doc.ref.update({challenge: challengeName}) }) })
    
                    // If the name of this challenge has changed, then update it in all linked profile posts.
                    db.collection("posts").where("challenge", "==", editChallenge.name).get()
                    .then((docs) => { docs.forEach((doc) => { doc.ref.update({challenge: challengeName}) }) })
                }
                else { // IF FORM SUBMITTED TO CREATE A NEW CHALLENGE.
                    db.collection("challenges").doc(challengeName).get()
                    .then((challengeDoc) => {
                        if(challengeDoc.exists) {
                            setSnackbarErrorMessage("A challenge with this name already exists!")
                            setOpenErrorSnackbar(true)
                        }
                        else{ 
                            let newChallenge = {
                                key: challengeDoc.id,
                                creator: user.displayName,
                                creatorPhotoUrl: user.photoUrl,
                                description: challengeDescription,
                                hints: [challengeHint1, challengeHint2,challengeHint3],
                                invitees: [],
                                participants: [],
                                isPrivate: challengeIsPrivate,
                                name: challengeName,
                                leader: "",
                                startDate: challengeStartDate.toDateString(),
                                endDate: challengeEndDate.toDateString(),
                                endTimeStamp : challengeEndDate,   
                                ended:false,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp()
                            }
                    
                            db.collection("challenges").doc(challengeName).set(newChallenge)
                            .then(() => {
                                handleFormClose()
                                setLoadChallenges(true)
                            })
                            .catch((error) => {
                            });
                        }
                    })
                } 
            }
        } else { 
            setSnackbarErrorMessage("Sorry! You have already created 3 challenges this week.")
            setOpenErrorSnackbar(true)
        }
    }

    // Function to toggle Public / Private Switch.
    const handleSwitchChange = (event) => {
        setPublicSwitch({ ...publicSwitch, [event.target.name]: event.target.checked })
        setChallengeIsPrivate((prev) => !prev)
    }

    useEffect(() => { 
        let isMounted = true // To ensure the component doesnt get loaded before the component is mounted.
        if(isMounted) { loadChallengeObjects(); }
        return () => { isMounted = false }
        // eslint-disable-next-line
    }, [loadChallenges])

    return (
        <div className="challengesPage" style={{paddingBottom: "80px"}}>
            {/* Header containing Heading and Add button. */}
            <div className="heading_add"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: 'center'
                }}
            >
                <p style={{fontSize: "3.5vh", alignItems:'center'}}>Looking for a Challenge?</p> {/* Page heading. */}
                <Fab color="primary"  aria-label="add" className={classes.fab} onClick={() => handleFormOpen(false)}> <AddIcon /> </Fab> {/* Floating Action Button */}
            </div>
            
            { challenges } {/* Render all challenge objects in the challenges list. */}

            {/* Form to input new Challenge will only appear when add button clicked. */}
            <Dialog open={openForm} onClose={handleFormClose} aria-labelledby="form-dialog-title">
                    {
                        (editChallenge !== null) ?
                        <DialogTitle id="form-dialog-title">Edit Challenge</DialogTitle>:
                        <DialogTitle id="form-dialog-title">Create Challenge</DialogTitle>
                    }               
                        <>  {/* FORM OPENED TO EDIT A CHALLLENGE. */}
                            
                            <DialogContent>
                                <DialogContentText>
                                    Feel free to edit any aspect of this challenge.
                                </DialogContentText>

                                {/* Challenge Name Input & Public/Private */}
                                <div className="name_public">
                                    {/* Challenge Name */}
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Challenge Title"
                                        type="text"
                                        fullWidth
                                        required
                                        placeholder={challengeName}
                                        value={challengeName}
                                        onChange={(event) => {setChallengeName(event.target.value)}}
                                    />

                                    {/* Toggle Public / Private */}
                                    {   
                                        editChallenge === null &&
                                        <FormControlLabel
                                            control={
                                            <Switch
                                                checked={publicSwitch.checkedA}
                                                onChange={handleSwitchChange}
                                                name="public"
                                                color="primary"
                                            />
                                            }
                                            label="Public"
                                        />
                                    }
                                    
                                </div>

                                {/* Challenge Description Input */}
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="description"
                                    label="Challenge Description"
                                    type="text"
                                    fullWidth
                                    required
                                    value={challengeDescription}
                                    placeholder={challengeDescription}
                                    onChange={(event) => {setChallengeDescription(event.target.value)}}
                                />

                                {/* Hints */}
                                <div className="hints" style={{display:"flex"}}>
                                    {/* Hint 1 */}
                                    <TextField 
                                        autoFocus
                                        margin="dense"
                                        id="hint1"
                                        label="Hint 1"
                                        type="text"
                                        fullWidth
                                        value={challengeHint1}
                                        placeholder={challengeHint1}
                                        onChange={(event) => {setChallengeHint1(event.target.value)}}
                                    />

                                    {/* Hint 2 */}
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="hint2"
                                        label="Hint 2"
                                        type="text"
                                        fullWidth
                                        value={challengeHint2}
                                        placeholder={challengeHint2}
                                        onChange={(event) => {setChallengeHint2(event.target.value)}}
                                    />

                                    {/* Hint 3 */}
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="hint3"
                                        label="Hint 3"
                                        type="text"
                                        fullWidth
                                        value={challengeHint3}
                                        placeholder={challengeHint3}
                                        onChange={(event) => {setChallengeHint3(event.target.value)}}
                                    />
                                </div>

                                <br />
                                {/* Challenge Begin and End Date */}
                                <div className="dates" style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: 'center',
                                }}>
                                    <div>Start Date:<br /><DatePicker selected={challengeStartDate} onChange={date => setChallengeStartDate(date)} /></div>
                                    <div>End Date:<br /><DatePicker selected={challengeEndDate} onChange={date => setChallengeEndDate(date)} /></div>   
                                </div>
                            </DialogContent>
                        </>
                <DialogActions>
                    <Button onClick={handleFormClose} color="primary"> Cancel </Button>
                    <Button onClick={() => handleFormSubmit()} color="primary"> Submit </Button>
                </DialogActions>
            </Dialog>

            {/* Error SnackBar */}
            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={() => setOpenErrorSnackbar(false)}>
                <Alert onClose={() => setOpenErrorSnackbar(false)} severity="error">
                    {snackbarErrorMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}