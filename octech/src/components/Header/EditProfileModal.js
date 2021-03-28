import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import "./EditProfileModal.css"
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from 'react-bootstrap/Modal';
import { auth, db } from "../../firebase";
import firebase from "firebase"
import { useHistory } from "react-router-dom";

const EditProfileModal = ({ setShowEditProfile }) => {
    const user = useSelector(selectUser);
    const history = useHistory();

    const [editName, setEditName] = useState(false);
    const [name, setName] = useState(user.displayName);
    const [nameNotUnique, setNameNotUnique] = useState(false)

    const [editEmail, setEditEmail] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [emailAlreadyInUse, setEmailAlreadyInUse] = useState(false)

    const [editPassword, setEditPassword] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [oldPasswordDoesNotMatch, setOldPasswordDoesNotMatch] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordNotEnough, setnewPasswordNotEnough] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [retypePassword, setRetypePassword] = useState("");
    const [retypePasswordDoesNotMatch, setRetypePasswordDoesNotMatch] = useState("");
    const [showRetypePassword, setShowRetypePassword] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordDoesNotMatch, setconfirmPasswordDoesNotMatch] = useState("");
    const [showconfirmPassword, setShowconfirmPassword] = useState(false);

    const [showConfirmDeleteAccount, setShowConfirmDeleteAccount] = useState(false)

    const submitHandler = async () => {
        let noError = true
        const useR = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
        // Now you can use that to reauthenticate
        await useR.reauthenticateWithCredential(credential).then(async function (result) {

            if (editName)
                await db.collection("users").doc(name).get().then(user => {
                    if (user.data()) {
                        setNameNotUnique(true)
                        noError = false;
                    }
                })
            if (editEmail) {
                await db.collection("users").where("email", "==", email).limit(1).get().then(docs => {
                    docs.forEach(doc => {
                        noError = false
                        setEmailAlreadyInUse(true)
                    })
                })

            }
            if (editPassword) {
                if (!newPassword)
                    noError = false
                if (newPassword !== retypePassword) {
                    noError = false
                    setRetypePasswordDoesNotMatch(true)
                }
            }
            if (noError) {
                setShowEditProfile(false)
                if (editName) {
                    await editUserName(name)
                }
                if (editEmail) {
                    useR.updateEmail(email).then(function () {
                        // useR.reload()
                        useR.sendEmailVerification().then(function () {
                        }).catch(function (error) {
                            console.log(error)
                        });
                    }).catch(function (error) {
                        console.log(error)
                    });
                    await db.collection("users").doc(useR.displayName).update({ email: email })
                }
                if (editPassword) {
                    useR.updatePassword(newPassword).then(function () {
                        // Update successful.
                    }).catch(function (error) {
                        console.log(error)
                    });
                }
            }
        }).catch(function (error) {
            console.log(error, "e")
            setOldPasswordDoesNotMatch(true)
        });
        firebase.auth().currentUser.reload()
    }
    const deleteAccount = async () => {

        const useR = firebase.auth().currentUser;
        if (auth.currentUser.providerData[0].providerId !== "google.com") {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, confirmPassword);
            // Now you can use that to reauthenticate
            await useR.reauthenticateWithCredential(credential).then(async function (result) {
                setShowConfirmDeleteAccount(false)
                setShowEditProfile(false)

                // //Delete User details
                await db.collection("users").doc(user.displayName).collection("notifications").get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("users").doc(user.displayName).collection("notifications").doc(doc.id).delete()
                    });
                })
                await db.collection("users").doc(user.displayName).delete()

                // Delete posts and post images
                await db.collection("posts").where("name", "==", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("postImages").where("ref", "==", doc.id).get().then(docs => {
                            docs.forEach(dpc => {
                                db.collection("postImages").doc(dpc.id).delete()
                            })
                        })
                        db.collection("posts").doc(doc.id).delete()
                    })
                })

                // Delete posts and post images
                await db.collection("posts").where("channelBy", "==", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("postImages").where("ref", "==", doc.id).get().then(docs => {
                            docs.forEach(dpc => {
                                db.collection("postImages").doc(dpc.id).delete()
                            })
                        })
                        db.collection("posts").doc(doc.id).delete()
                    })
                })

                //Delete portfolio
                await db.collection("portfolios").doc(user.displayName).delete()

                //Delete forum posts
                await db.collection("forumPosts").where("name", "==", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("postImages").where("ref", "==", doc.id).get().then(docs => {
                            docs.forEach(dpc => {
                                db.collection("postImages").doc(dpc.id).delete()
                            })
                        })
                        db.collection("forumPosts").doc(doc.id).delete()
                    })
                })
                //Delete Collection
                await db.collection("collections").where("creator", "==", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("collections").doc(user.displayName + doc.data().name).delete()
                    })
                })

                //Delete Channaels
                await db.collection("channels").where("creator", "==", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("channels").doc(doc.id).delete()
                    })
                })

                //Delete Challenge and its posts
                await db.collection("challenges").where("creator", "==", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("challenges").doc(doc.data().name).delete()
                    })
                })
                await db.collection("challengePosts").where("creator", "==", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("challengePosts").doc(doc.id).delete()
                        db.collection("posts").doc(doc.id).update({
                            challenge: firebase.firestore.FieldValue.delete()
                        })
                    })
                })

                //Delete Bug report
                await db.collection("BugReports").where("name", "==", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("BugReports").doc(doc.id).delete()
                    })
                })

                //Delete from Chat rooms
                await db.collection("chatRooms").where("participantNames", "array-contains", user.displayName).get().then(docs => {
                    docs.forEach(doc => {
                        const docRef = db.collection("chatRooms").doc(doc.id)
                        let data = doc.data()
                        let participantNames = data.participantNames.filter(n => name !== user.displayName)
                        let participants = data.participants.filter(u => u.name !== user.displayName)
                        const collectionRef = docRef.collection("messages")
                        docRef.update({ participantNames: participantNames, participants: participants })
                    })
                })

                //Delete from friends and friends requested and blocked and all
                await db.collection("users").get().then(docs => {
                    docs.forEach(doc => {
                        let data = doc.data()
                        if (data.blocked.includes(user.displayName) || data.blockedBy.includes(user.displayName) || data.friendRequestReceived.includes(user.displayName) || data.friendRequestSent.includes(user.displayName) || data.friends.some(u => u.name === user.displayName)) {
                            const blocked = data.blocked.filter(n => n !== user.displayName)
                            const blockedBy = data.blockedBy.filter(n => n !== user.displayName)
                            const friendRequestReceived = data.friendRequestReceived.filter(n => n !== user.displayName)
                            const friendRequestSent = data.friendRequestSent.filter(n => n !== user.displayName)
                            const friends = data.friends.filter(u => u.name !== user.displayName)
                            db.collection("users").doc(data.name).update({
                                blocked: blocked,
                                blockedBy: blockedBy,
                                friendRequestReceived: friendRequestReceived,
                                friendRequestSent: friendRequestSent,
                                friends: friends
                            })
                        }
                    })
                })

                //Delete comments from all kind of posts
                await db.collection("posts").get().then(docs => {
                    docs.forEach(doc => {
                        let data = doc.data()
                        if (data.comments && data.comments.some(c => c.name === user.displayName)) {
                            const comments = data.comments.filter(n => n.name !== user.displayName)
                            db.collection("posts").doc(doc.id).update({ comments: comments })
                        }
                    })
                })
                await db.collection("forumPosts").get().then(docs => {
                    docs.forEach(doc => {
                        let data = doc.data()
                        if (data.comments && data.comments.some(c => c.name === user.displayName)) {
                            const comments = data.comments.filter(n => n.name !== user.displayName)
                            db.collection("forumPosts").doc(doc.id).update({ comments: comments })
                        }
                    })
                })
                //Delete follower from the channel
                await db.collection("channels").get().then(docs => {
                    docs.forEach(doc => {
                        let data = doc.data()
                        if (data.followers && data.followers.some(c => c.name === user.displayName)) {
                            const followers = data.followers.filter(n => n.name !== user.displayName)
                            db.collection("channels").doc(doc.id).update({ followers: followers })
                        }
                    })
                })

                // //Delete participant from Challenges
                await db.collection("challenges").get().then(docs => {
                    docs.forEach(doc => {
                        let data = doc.data()
                        if ((data.invitees && data.invitees.includes(user.displayName)) || (data.participants && data.participants.some(u => u.displayName === user.displayName))) {
                            const invitees = data.invitees.filter(u => u !== user.displayName)
                            const participants = data.participants.filter(u => u.displayName !== user.displayName)
                            db.collection("challenges").doc(doc.id).update({
                                participants: participants,
                                invitees: invitees
                            })
                        }
                    })
                })
                await firebase.auth().currentUser.delete()
                history.push('/');
                window.location.reload();
            }).catch(function (error) {
                console.log(error, "e")
                setconfirmPasswordDoesNotMatch(true)
            });
        }
        else {
            setShowConfirmDeleteAccount(false)
            setShowEditProfile(false)

            // //Delete User details
            await db.collection("users").doc(user.displayName).collection("notifications").get().then(docs => {
                docs.forEach(doc => {
                    db.collection("users").doc(user.displayName).collection("notifications").doc(doc.id).delete()
                });
            })
            await db.collection("users").doc(user.displayName).delete()

            // Delete posts and post images
            await db.collection("posts").where("name", "==", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    db.collection("postImages").where("ref", "==", doc.id).get().then(docs => {
                        docs.forEach(dpc => {
                            db.collection("postImages").doc(dpc.id).delete()
                        })
                    })
                    db.collection("posts").doc(doc.id).delete()
                })
            })

            // Delete posts and post images
            await db.collection("posts").where("channelBy", "==", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    db.collection("postImages").where("ref", "==", doc.id).get().then(docs => {
                        docs.forEach(dpc => {
                            db.collection("postImages").doc(dpc.id).delete()
                        })
                    })
                    db.collection("posts").doc(doc.id).delete()
                })
            })

            //Delete portfolio
            await db.collection("portfolios").doc(user.displayName).delete()

            //Delete forum posts
            await db.collection("forumPosts").where("name", "==", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    db.collection("postImages").where("ref", "==", doc.id).get().then(docs => {
                        docs.forEach(dpc => {
                            db.collection("postImages").doc(dpc.id).delete()
                        })
                    })
                    db.collection("forumPosts").doc(doc.id).delete()
                })
            })
            //Delete Collection
            await db.collection("collections").where("creator", "==", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    db.collection("collections").doc(user.displayName + doc.data().name).delete()
                })
            })

            //Delete Channaels
            await db.collection("channels").where("creator", "==", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    db.collection("channels").doc(doc.id).delete()
                })
            })

            //Delete Challenge and its posts
            await db.collection("challenges").where("creator", "==", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    db.collection("challenges").doc(doc.data().name).delete()
                })
            })
            await db.collection("challengePosts").where("creator", "==", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    db.collection("challengePosts").doc(doc.id).delete()
                    db.collection("posts").doc(doc.id).update({
                        challenge: firebase.firestore.FieldValue.delete()
                    })
                })
            })

            //Delete Bug report
            await db.collection("BugReports").where("name", "==", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    db.collection("BugReports").doc(doc.id).delete()
                })
            })

            //Delete from Chat rooms
            await db.collection("chatRooms").where("participantNames", "array-contains", user.displayName).get().then(docs => {
                docs.forEach(doc => {
                    const docRef = db.collection("chatRooms").doc(doc.id)
                    let data = doc.data()
                    let participantNames = data.participantNames.filter(n => name !== user.displayName)
                    let participants = data.participants.filter(u => u.name !== user.displayName)
                    const collectionRef = docRef.collection("messages")
                    docRef.update({ participantNames: participantNames, participants: participants })
                })
            })

            //Delete from friends and friends requested and blocked and all
            await db.collection("users").get().then(docs => {
                docs.forEach(doc => {
                    let data = doc.data()
                    if (data.blocked.includes(user.displayName) || data.blockedBy.includes(user.displayName) || data.friendRequestReceived.includes(user.displayName) || data.friendRequestSent.includes(user.displayName) || data.friends.some(u => u.name === user.displayName)) {
                        const blocked = data.blocked.filter(n => n !== user.displayName)
                        const blockedBy = data.blockedBy.filter(n => n !== user.displayName)
                        const friendRequestReceived = data.friendRequestReceived.filter(n => n !== user.displayName)
                        const friendRequestSent = data.friendRequestSent.filter(n => n !== user.displayName)
                        const friends = data.friends.filter(u => u.name !== user.displayName)
                        db.collection("users").doc(data.name).update({
                            blocked: blocked,
                            blockedBy: blockedBy,
                            friendRequestReceived: friendRequestReceived,
                            friendRequestSent: friendRequestSent,
                            friends: friends
                        })
                    }
                })
            })

            //Delete comments from all kind of posts
            await db.collection("posts").get().then(docs => {
                docs.forEach(doc => {
                    let data = doc.data()
                    if (data.comments && data.comments.some(c => c.name === user.displayName)) {
                        const comments = data.comments.filter(n => n.name !== user.displayName)
                        db.collection("posts").doc(doc.id).update({ comments: comments })
                    }
                })
            })
            await db.collection("forumPosts").get().then(docs => {
                docs.forEach(doc => {
                    let data = doc.data()
                    if (data.comments && data.comments.some(c => c.name === user.displayName)) {
                        const comments = data.comments.filter(n => n.name !== user.displayName)
                        db.collection("forumPosts").doc(doc.id).update({ comments: comments })
                    }
                })
            })
            //Delete follower from the channel
            await db.collection("channels").get().then(docs => {
                docs.forEach(doc => {
                    let data = doc.data()
                    if (data.followers && data.followers.some(c => c.name === user.displayName)) {
                        const followers = data.followers.filter(n => n.name !== user.displayName)
                        db.collection("channels").doc(doc.id).update({ followers: followers })
                    }
                })
            })

            // //Delete participant from Challenges
            await db.collection("challenges").get().then(docs => {
                docs.forEach(doc => {
                    let data = doc.data()
                    if ((data.invitees && data.invitees.includes(user.displayName)) || (data.participants && data.participants.some(u => u.displayName === user.displayName))) {
                        const invitees = data.invitees.filter(u => u !== user.displayName)
                        const participants = data.participants.filter(u => u.displayName !== user.displayName)
                        db.collection("challenges").doc(doc.id).update({
                            participants: participants,
                            invitees: invitees
                        })
                    }
                })
            })
            await firebase.auth().currentUser.delete()
            history.push('/');
            window.location.reload();
        }
    }
    const editUserName = async newName => {

        // //Update User details
        firebase.auth().currentUser.updateProfile({ displayName: newName }).then(function () {
            // Profile updated successfully!
            // firebase.auth().currentUser.reload()
        }, function (error) {
            console.log(error)
        });
        await db.collection("users").doc(user.displayName).get().then(async doc => {
            const data = { ...doc.data(), name: newName }
            await db.collection("users").doc(newName).set(data).then(async () => {
                db.collection("users").doc(user.displayName).delete()
            })
        })

        // Update posts and post images
        await db.collection("posts").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                let com = false
                let comments = []
                if (data.comments) {
                    comments = data.comments.map(comment => {
                        if (comment.name === user.displayName) {
                            com = true
                            return { ...comment, name: newName }
                        }
                        else
                            return comment
                    })
                }
                if (data.channelBy === user.displayName)
                    if (com)
                        db.collection("posts").doc(doc.id).update({ channelBy: newName, comments: comments })
                    else
                        db.collection("posts").doc(doc.id).update({ channelBy: newName })
                else if (data.name === user.displayName)
                    if (com)
                        db.collection("posts").doc(doc.id).update({ name: newName, comments: comments })
                    else
                        db.collection("posts").doc(doc.id).update({ name: newName })
                else if (com)
                    db.collection("posts").doc(doc.id).update({ comments: comments })
            })
        })

        //Update portfolio
        await db.collection("portfolios").doc(user.displayName).get().then(async doc => {
            const data = doc.data()
            if (data)
                await db.collection("portfolios").doc(newName).set(data).then(async () => {
                    db.collection("portfolios").doc(user.displayName).delete()
                })
        })

        //Update forum posts
        await db.collection("forumPosts").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                let com = false
                let comments = []
                if (data.comments) {
                    comments = data.comments.map(comment => {
                        if (comment.name === user.displayName) {
                            com = true
                            return { ...comment, name: newName }
                        }
                        else
                            return comment
                    })
                }
                if (data.channelBy === user.displayName)
                    if (com)
                        db.collection("forumPosts").doc(doc.id).update({ channelBy: newName, comments: comments })
                    else
                        db.collection("forumPosts").doc(doc.id).update({ channelBy: newName })
                else if (data.name === user.displayName)
                    if (com)
                        db.collection("forumPosts").doc(doc.id).update({ name: newName, comments: comments })
                    else
                        db.collection("forumPosts").doc(doc.id).update({ name: newName })
                else if (com)
                    db.collection("forumPosts").doc(doc.id).update({ comments: comments })
            })
        })

        //Update Collection
        await db.collection("collections").where("creator", "==", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                db.collection("collections").doc(user.displayName + doc.data().name).update({ creator: newName })
            })
        })

        //Update Channaels
        await db.collection("channels").where("creator", "==", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                db.collection("channels").doc(doc.id).update({ creator: newName })
            })
        })

        //Update Challenge and its posts
        await db.collection("challenges").where("creator", "==", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                db.collection("challenges").doc(doc.data().name).update({ creator: newName })
            })
        })
        await db.collection("challengePosts").where("creator", "==", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                db.collection("challengePosts").doc(doc.id).update({ creator: newName })
            })
        })

        //Update Bug report
        await db.collection("BugReports").where("name", "==", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                db.collection("BugReports").doc(doc.id).update({ name: newName })
            })
        })

        //Update from Chat rooms
        await db.collection("chatRooms").where("participantNames", "array-contains", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                const docRef = db.collection("chatRooms").doc(doc.id)
                let data = doc.data()
                let participantNames = data.participantNames.filter(n => name !== user.displayName).push(newName)
                let participants = data.participants.map(u => u.name !== user.displayName ? u : { ...u, name: newName })
                docRef.update({ participantNames: participantNames, participants: participants })
                const collectionRef = docRef.collection("messages")
            })
        })

        //Update from friends and friends requested and blocked and all
        await db.collection("users").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                if (data.blocked.includes(user.displayName) || data.blockedBy.includes(user.displayName) || data.friendRequestReceived.includes(user.displayName) || data.friendRequestSent.includes(user.displayName) || data.friends.some(u => u.name === user.displayName)) {
                    const blocked = data.blocked.map(n => n !== user.displayName ? n : newName)
                    const blockedBy = data.blockedBy.map(n => n !== user.displayName ? n : newName)
                    const friendRequestReceived = data.friendRequestReceived.map(n => n !== user.displayName ? n : newName)
                    const friendRequestSent = data.friendRequestSent.map(n => n !== user.displayName ? n : newName)
                    const friends = data.friends.map(u => u.name !== user.displayName ? u : { ...u, name: newName })
                    db.collection("users").doc(data.name).update({
                        blocked: blocked,
                        blockedBy: blockedBy,
                        friendRequestReceived: friendRequestReceived,
                        friendRequestSent: friendRequestSent,
                        friends: friends
                    })
                }
            })
        })

        //Update follower from the channel
        await db.collection("channels").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                if (data.followers && data.followers.some(c => c.name === user.displayName)) {
                    const followers = data.followers.map(u => u.name !== user.displayName ? u : { ...u, name: newName })
                    db.collection("channels").doc(doc.id).update({ followers: followers })
                }
            })
        })

        // //Update participant from Challenges
        await db.collection("challenges").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                if ((data.invitees && data.invitees.includes(user.displayName)) || (data.participants && data.participants.some(u => u.displayName === user.displayName))) {
                    const invitees = data.invitees.map(n => n !== user.displayName ? n : newName)
                    const participants = data.participants.map(u => u.displayName !== user.displayName ? u : { ...u, displayName: newName })
                    db.collection("challenges").doc(doc.id).update({
                        participants: participants,
                        invitees: invitees
                    })
                }
            })
        })

    }

    return (
        <div style={{ margin: "10px" }}>
            <TextField id="userNameField" className="field" variant="outlined" label="Username" placeholder="Enter New Username" helperText={!name ? "Username cannot be empty" : nameNotUnique ? "Username should be unique" : ""} error={!name | nameNotUnique} value={name} onChange={(event) => { setName(event.target.value); if (nameNotUnique) setNameNotUnique(false) }} fullWidth InputLabelProps={{ shrink: true, }}
                InputProps={{
                    readOnly: !editName,
                    endAdornment:
                        (editName ?
                            <>
                                <IconButton aria-label="cancel edit name" onClick={() => { setEditName(false); setName(user.displayName) }}>
                                    <ClearIcon />
                                </IconButton>
                            </>
                            :
                            <IconButton aria-label="edit name" onClick={() => { setEditName(true); setName("") }}>
                                <EditIcon />
                            </IconButton>)
                }}
            />

            {auth.currentUser.providerData[0].providerId !== "google.com" && <TextField id="emailField" className="field" variant="outlined" label="Email" placeholder="Enter New Email" helperText={!email ? "Email cannot be empty" : emailAlreadyInUse ? "Email already in use" : ""} error={!email | emailAlreadyInUse} value={email} onChange={(event) => { setEmail(event.target.value); if (emailAlreadyInUse) setEmailAlreadyInUse(false) }} fullWidth InputLabelProps={{ shrink: true, }}
                InputProps={{
                    readOnly: !editEmail,
                    type: "email",
                    validate: true,
                    endAdornment:
                        (editEmail ?
                            <>
                                <IconButton aria-label="cancel edit email" onClick={() => { setEditEmail(false); setEmail(user.email) }}>
                                    <ClearIcon />
                                </IconButton>
                            </>
                            :
                            <IconButton aria-label="edit email" onClick={() => { setEditEmail(true); setEmail("") }}>
                                <EditIcon />
                            </IconButton>)
                }}
            />}
            {auth.currentUser.providerData[0].providerId !== "google.com" && <TextField id="currentPassword" className="field" variant="outlined" label="Current Password" placeholder="Enter Your Current Password" helperText={!oldPassword ? "Current Password cannot be empty" : oldPasswordDoesNotMatch ? "Current Password incorrect" : ""} error={!oldPassword | oldPasswordDoesNotMatch} value={oldPassword} onChange={(event) => { setOldPassword(event.target.value); if (oldPasswordDoesNotMatch) setOldPasswordDoesNotMatch(false) }} fullWidth InputLabelProps={{ shrink: true, }}
                InputProps={{
                    type: showOldPassword ? 'text' : 'password',
                    endAdornment:
                        <IconButton
                            aria-label="toggle oldPassword visibility"
                            onClick={() => { setShowOldPassword(!showOldPassword) }}
                            onMouseDown={(e) => { e.preventDefault() }}
                            edge="end"
                        >
                            {showOldPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                }}
            />}
            {auth.currentUser.providerData[0].providerId !== "google.com" && <InputBase
                defaultValue="Change Password"
                readOnly
                fullWidth
                className="pass"
                endAdornment={
                    (editPassword ?
                        <>
                            <IconButton aria-label="cancel edit Password" onClick={() => { setEditPassword(false) }}>
                                <ClearIcon />
                            </IconButton>
                        </>
                        :
                        <IconButton aria-label="edit password" onClick={() => { setEditPassword(true) }}>
                            <EditIcon />
                        </IconButton>)}
            />}

            {editPassword ?
                <>
                    <TextField id="newPassword" className="field" variant="outlined" label="New Password" placeholder="Enter New Password" helperText={!newPassword ? "New Password cannot be empty" : newPasswordNotEnough ? "New password does not meet minimum requirements" : ""} error={!newPassword | newPasswordNotEnough} value={newPassword} onChange={(event) => { setNewPassword(event.target.value) }} fullWidth InputLabelProps={{ shrink: true, }}
                        InputProps={{
                            type: showNewPassword ? 'text' : 'password',
                            endAdornment:
                                <IconButton
                                    aria-label="toggle oldPassword visibility"
                                    onClick={() => { setShowNewPassword(!showNewPassword) }}
                                    onMouseDown={(e) => { e.preventDefault() }}
                                    edge="end"
                                >
                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                        }}
                    />
                    <TextField id="retypePassword" className="field" variant="outlined" label="Retype Password" placeholder="Enter Retype Password" helperText={!retypePassword ? "Retype Password cannot be empty" : retypePasswordDoesNotMatch ? "New Password and Retype Password do no match" : ""} error={!retypePassword | retypePasswordDoesNotMatch} value={retypePassword} onChange={(event) => { setRetypePassword(event.target.value); if (retypePasswordDoesNotMatch) setRetypePasswordDoesNotMatch(false) }} fullWidth InputLabelProps={{ shrink: true, }}
                        InputProps={{
                            type: showRetypePassword ? 'text' : 'password',
                            endAdornment:
                                <IconButton
                                    aria-label="toggle oldPassword visibility"
                                    onClick={() => { setShowRetypePassword(!showRetypePassword) }}
                                    onMouseDown={(e) => { e.preventDefault() }}
                                    edge="end"
                                >
                                    {showRetypePassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                        }}
                    />
                </>
                :
                <>
                </>
            }
            <Modal
                show={showConfirmDeleteAccount}
                onHide={() => { setShowConfirmDeleteAccount(false) }}
                keyboard={false}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    {auth.currentUser.providerData[0].providerId !== "google.com" && <TextField id="confirmPassword" className="field" variant="outlined" label="Confirm Password" placeholder="Enter Your Password" helperText={!confirmPassword ? "Password cannot be empty" : confirmPasswordDoesNotMatch ? "Incorrect Password" : ""} error={!confirmPassword | confirmPasswordDoesNotMatch} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); if (confirmPasswordDoesNotMatch) setconfirmPasswordDoesNotMatch(false) }} fullWidth InputLabelProps={{ shrink: true, }}
                        InputProps={{
                            type: showconfirmPassword ? 'text' : 'password',
                            endAdornment:
                                <IconButton
                                    aria-label="toggle oldPassword visibility"
                                    onClick={() => { setShowconfirmPassword(!showconfirmPassword) }}
                                    onMouseDown={(e) => { e.preventDefault() }}
                                    edge="end"
                                >
                                    {showconfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                        }}
                    />}
                    <Box component="span" m={1} className="buttonContainer2">
                        <Button
                            variant="contained"
                            color="primary"
                            className="buttons"
                            startIcon={<ClearIcon />}
                            onClick={() => { setShowConfirmDeleteAccount(false) }}
                        >
                            Cancel
                </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className="buttons"
                            startIcon={<DeleteIcon />}
                            onClick={deleteAccount}
                        >
                            Yes Delete My Account
                </Button>
                    </Box>
                </Modal.Body>
            </Modal>
            <Box component="span" m={1} className="buttonContainer">
                <Button
                    variant="contained"
                    color="secondary"
                    className="buttons"
                    startIcon={<DeleteIcon />}
                    onClick={() => { setShowConfirmDeleteAccount(true) }}
                >
                    <b>Delete Account</b>
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className="buttons"
                    startIcon={<ClearIcon />}
                    onClick={() => { setShowEditProfile(false) }}
                >
                    <b>Cancel</b>
                </Button>
                {(editName | editPassword | editEmail) ?
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            className="buttons"
                            endIcon={<EditIcon />}
                            onClick={submitHandler}
                        >
                            <b>Submit</b>
                        </Button>
                    </>
                    :
                    <>
                    </>}
            </Box>
        </div>
    )
}

export default EditProfileModal;