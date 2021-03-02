import React, { useState, useEffect } from 'react'

import { useSelector } from "react-redux" // Related to routing.
import { selectUser } from "../features/userSlice" // Related to routing.

import firebase from "firebase"
import { db, storage } from "../firebase"
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function ChallengesPage({ match }) {
    const user = useSelector(selectUser) // Related to routing.
    const userName = user.displayName // Name of current users.
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

    // Function that loads all challenges
    const loadChallengeObjects = () => {
        // Load challenges (once).
        if(loadChallenges) { // If challenges are to be loaded, then load them.
            setChallenges([]) // Set challenges to an empty array.

            db.collection('challenges').get() // Get challenges from db.
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    let data = doc.data() // data = a single challenge object.

                    // Display only if ...
                    if(!data.isPrivate || // The challenge is not private.
                        data.creator === userName || // The user is the creator of the challenge.
                        Object.keys(data.invitees).includes(userName)){ // The user was invited to this challenge.
                        setChallenges(prevArr => { // Create a Challenge object and add to the list of challenges. 
                            return prevArr.concat([
                                <Challenge
                                    name={data.name}
                                    description={data.description}
                                    hints={data.hints} 
                                    creator={data.creator}
                                    creatorPhotoUrl={data.creatorPhotoUrl}
                                    isPrivate={data.isPrivate}
                                    code={data.code} 
                                    isAdmin={data.creator === userName} 
                                    entries={data.entries}
                                > </Challenge>
                            ])
                        })
                    }
                })
            })
            setLoadChallenges(false)
        }
    }

    // Function that opens the input form to create a new challenge.
    const handleFormOpen = () => {
        setOpenForm(true);
    }

    // Function that closes the input form to create a new challenge.
    const handleFormClose = () => {
        setOpenForm(false);
    }

    // Function that submits the form to add a new challenge.
    const handleFormSubmit = () => {
        console.log("Form Submitted!")

        if(!alphaNumeric.test(challengeName) || !alphaNumeric.test(challengeDescription)) {
            alert("Please enter valid data in required fields, Challenge Title and Challenge Description.")
        }

        else {
            let newChallenge = {
                code: "",
                creator: user.displayName,
                creatorPhotoUrl: user.photoUrl,
                description: challengeDescription,
                entries: [],
                hints: [challengeHint1, challengeHint2,challengeHint3],
                invitees: {},
                isPrivate: challengeIsPrivate,
                name: challengeName,
            }
    
            db.collection("challenges").add(newChallenge)
            .then((docRef) => {
                db.collection("challenges").doc(docRef.id)
                .update({code: docRef.id})
                .then(() => {
                    console.log("Document written with ID: ", docRef.id)
                    handleFormClose()
                    setLoadChallenges(true)
                })
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        }
    }

    // Function to toggle Public / Private Switch.
    const handleSwitchChange = (event) => {
        setPublicSwitch({ ...publicSwitch, [event.target.name]: event.target.checked })
        setChallengeIsPrivate((prev) => !prev)
    }

    useEffect(() => { loadChallengeObjects() }, [loadChallenges])

    return (
        <div className="challengesPage" style={{paddingBottom: "80px"}}>
            {/* Header containing Heading and Add button. */}
            <div 
                className="challengePageHeader"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "5% 10% 0% 10%"
                }}
            >
                <h1>Looking for a Challenge?</h1> {/* Page heading. */}
                <Fab color="primary" aria-label="add" onClick={handleFormOpen}> <AddIcon /> </Fab> {/* Floating Action Button */}
            </div>
            
            { challenges } {/* Render all challenge objects in the challenges list. */}

            {/* Form to input new Challenge will only appear when add button clicked. */}
            <Dialog open={openForm} onClose={handleFormClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Challenge</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create a new challenge, please provide the name and description of the challenge. You may also provide upto 3 hints.
                    </DialogContentText>

                    {/* Challenge Name Input & Public/Private */}
                    <div className="name_public" style={{display:'flex'}}>
                        {/* Challenge Name */}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Challenge Title"
                            type="text"
                            fullWidth
                            required
                            onChange={(event) => {setChallengeName(event.target.value)}}
                        />

                        {/* Toggle Public / Private */}
                        <FormControlLabel
                            control={
                            <Switch
                                checked={publicSwitch.checkedA}
                                onChange={handleSwitchChange}
                                name="private"
                                color="primary"
                            />
                            }
                            label="Public"
                        />
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
                            onChange={(event) => {setChallengeHint3(event.target.value)}}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFormClose} color="primary"> Cancel </Button>
                    <Button onClick={handleFormSubmit} color="primary"> Submit </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}