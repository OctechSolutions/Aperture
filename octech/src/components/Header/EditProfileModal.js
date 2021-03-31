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
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
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

const EditProfileModal = ({ setShowEditProfile, setLoading }) => {
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
    const [newPasswordNotEnough, ] = useState("");
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
        if (auth.currentUser.providerData[0].providerId === "google.com") {
            if (editName)
                await db.collection("users").doc(name).get().then(user => {
                    if (user.data()) {
                        setNameNotUnique(true)
                        noError = false;
                    }
                })
            if (noError) {
                setShowEditProfile(false)
                setLoading(true)
                if (editName) {
                    await editUserName(name)
                }
                setLoading(false)
            }
        }
        else {
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
                    setLoading(true)
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
                    setLoading(false)
                }
            }).catch(function (error) {
                console.log(error, "e")
                setOldPasswordDoesNotMatch(true)
            });
        }
        firebase.auth().currentUser.reload()
        window.location.reload();
    }
    const deleteAccount = async () => {

        const useR = firebase.auth().currentUser;
        if (auth.currentUser.providerData[0].providerId !== "google.com") {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, confirmPassword);
            // Now you can use that to reauthenticate
            await useR.reauthenticateWithCredential(credential).then(async function (result) {
                setShowConfirmDeleteAccount(false)
                setShowEditProfile(false)
                setLoading(true)

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
                        docRef.collection("messages")
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
                setLoading(false)
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
            setLoading(true)

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
                    docRef.collection("messages")
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
            setLoading(false)
            history.push('/');
            window.location.reload();
        }
    }
    const editUserName = async newName => {

        await db.collection("users").doc(user.displayName).get().then(async doc => {
            const data = { ...doc.data(), name: newName }

            await db.collection("users").doc(newName).set(data).then(async () => {
                await db.collection("users").doc(user.displayName).collection("notifications").get().then(docs => {
                    docs.forEach(doc => {
                        db.collection("users").doc(user.displayName).collection("notifications").doc(doc.id).delete()
                    });
                })
                await db.collection("users").doc(user.displayName).delete()
            })
        })
        // //Update User details
        firebase.auth().currentUser.updateProfile({ displayName: newName }).then(function () {
            // Profile updated successfully!
            // firebase.auth().currentUser.reload()
        }, function (error) {
            console.log(error)
        });
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

        // //Update Bug report
        // await db.collection("BugReports").where("name", "==", user.displayName).get().then(docs => {
        //     docs.forEach(doc => {
        //         db.collection("BugReports").doc(doc.id).update({ name: newName })
        //     })
        // })

        //Update from Chat rooms
        await db.collection("chatRooms").where("participantNames", "array-contains", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                const docRef = db.collection("chatRooms").doc(doc.id)
                let data = doc.data()
                let participantNames = data.participantNames.map(n => n !== user.displayName ? n : newName)
                let participants = data.participants.map(u => u.name !== user.displayName ? u : { ...u, name: newName })
                docRef.update({ participantNames: participantNames, participants: participants })
                docRef.collection("messages")
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
    
    const editAvatar = async () => {
        setLoading(true)
        setShowAvatarEditor(false)
        auth.currentUser.updateProfile({
            photoURL: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`
        }); 
        if (auth.currentUser.displayName) {
            db.collection("users").doc(auth.currentUser.displayName).set({
                photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`
            }, { merge: true });
        };

        //Update from friends and friends requested and blocked and all
        await db.collection("users").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                if (data.friends.some(u => u.name === user.displayName)){
                    const friends = data.friends.map(u => u.name !== user.displayName ? u : { ...u, photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}` })
                    db.collection("users").doc(data.name).update({friends: friends })
                }
            })
        })

        // Update posts
        await db.collection("posts").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                if (data.channelBy === user.displayName || data.name === user.displayName)
                    db.collection("posts").doc(doc.id).update({ photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`  })
            })
        })

        // Update forumposts
        await db.collection("forumPosts").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                if (data.channelBy === user.displayName || data.name === user.displayName)
                    db.collection("forumPosts").doc(doc.id).update({ photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`  })
            })
        })

        //Update from Chat rooms
        await db.collection("chatRooms").where("participantNames", "array-contains", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                const docRef = db.collection("chatRooms").doc(doc.id)
                let data = doc.data()
                let participants = data.participants.map(u => u.name !== user.displayName ? u : { ...u, photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}` })
                docRef.update({ participants: participants })
            })
        })
        
        //Update follower from the channel
        await db.collection("channels").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                if (data.followers && data.followers.some(c => c.name === user.displayName)) {
                    const followers = data.followers.map(u => u.name !== user.displayName ? u : { ...u, photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`  })
                    db.collection("channels").doc(doc.id).update({ followers: followers })
                }
            })
        })

        //Update Challenge and its posts
        await db.collection("challenges").where("creator", "==", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                db.collection("challenges").doc(doc.data().name).update({creatorPhotoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}` })
            })
        })
        await db.collection("challengePosts").where("creator", "==", user.displayName).get().then(docs => {
            docs.forEach(doc => {
                db.collection("challengePosts").doc(doc.id).update({creatorPhotoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}` })
            })
        })
        //Challenge Participants
        await db.collection("challenges").get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data()
                if ((data.participants && data.participants.some(u => u.displayName === user.displayName))) {
                    const participants = data.participants.map(u => u.displayName !== user.displayName ? u : { ...u, photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}` })
                    db.collection("challenges").doc(doc.id).update({
                        participants: participants
                    })
                }
            })
        })

        setLoading(false)
        dispatch(login({
            email: auth.currentUser.email,
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            photoUrl: `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`,
            emailVerified: auth.currentUser.emailVerified
          }));
          setPreviewAvatar(`https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheType=${clotheType}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${hairColor}&mouthType=${mouthType}&skinColor=${skinColor}&topType=${topType}`)
         
    }

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
    const [previewAvatar, setPreviewAvatar] = useState(auth.currentUser.photoURL)


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
    const classes = useStyles();
    const dispatch = useDispatch(); // Keep track of changes on the user slice
    const [showAvatarEditor, setShowAvatarEditor] = useState(false)

    return (
        <div style={{ margin: "10px" }}>
            <center>
                <Avatar
                    src={previewAvatar}
                    className={classes.xl}
                />
                <br />
                <Button variant="outlined" endIcon={<EditIcon />} color="primary" onClick={() => { setShowAvatarEditor(true) }}>Edit Avatar</Button>
            </center>
            <br />
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
            <Modal
                show={showAvatarEditor}
                keyboard={false}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable={true}
            >
                <Modal.Header closeButton onClick={() => { setShowAvatarEditor(false) }}>
                    <div style={{ marginLeft: "auto", marginRight: "-25px" }}>
                        <h4 style={{ marginLeft: "auto", marginRight: "-25px" }}>Edit your Avatar!</h4>
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
                    <Button onClick={editAvatar} >
                        Done
                    </Button>
                    <Button onClick={() => { setShowAvatarEditor(false) }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditProfileModal;