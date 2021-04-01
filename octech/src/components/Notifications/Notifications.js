import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { useHistory } from "react-router-dom"
import CommentIcon from '@material-ui/icons/Comment';
import { blue, green, red } from '@material-ui/core/colors';
import moment from 'moment';
import { db } from "../../firebase";
import { useSelector } from "react-redux"
import { selectUser } from "../../features/userSlice"
import FlipMove from "react-flip-move";
import firebase from "firebase";
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import BlockIcon from '@material-ui/icons/Block';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '80%'
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
    },
    red: {
        color: '#fff',
        backgroundColor: red[500],
    },
    blue: {
        color: '#fff',
        backgroundColor: blue[500],
    },
    fab: {
        top: 'auto',
        bottom: 65,
        right: 20,
        position: 'fixed',
        zIndex: 999,
    },
}));

export default function Notifications({ match, notifications }) {
    const classes = useStyles();
    const history = useHistory()
    const user = useSelector(selectUser)
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    if (notifications === undefined) {
        notifications = []
    }

    var displayFunction = (notificationInfo) => {
        if (notificationInfo.type === "friendRequestSent") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar src={notificationInfo.icon} />}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/user/${notificationInfo.sender}`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b> sent you a friend request.</></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />


                <CardActions>
                    <Fab variant="extended" style={{ boxShadow: "none" }} onClick={() => {
                        setMessage(`Added ${notificationInfo.sender} as a friend`)
                        setOpen(true);
                        db.collection("users").doc(notificationInfo.sender).update({
                            friendRequestSent: firebase.firestore.FieldValue.arrayRemove(user.displayName),
                            friends: firebase.firestore.FieldValue.arrayUnion({ name: user.displayName, photoUrl: user.photoUrl })
                        });

                        db.collection("users").doc(user.displayName).update({
                            friendRequestReceived: firebase.firestore.FieldValue.arrayRemove(notificationInfo.sender),
                            friends: firebase.firestore.FieldValue.arrayUnion({ name: notificationInfo.sender, photoUrl: notificationInfo.icon })
                        });

                        db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })

                        db.collection("users").doc(notificationInfo.sender).collection("notifications").doc(notificationInfo.sender).set({
                            notifications: firebase.firestore.FieldValue.arrayUnion({
                                type: "friendRequestAccepted",
                                sentAt: firebase.firestore.Timestamp.now(),
                                sender: user.displayName,
                                icon: user.photoUrl
                            })
                        }, { merge: true })
                    }}>

                        <CheckIcon style={{ marginRight: "10px" }} />
                        <b>Accept</b>
                    </Fab>
                    <Fab variant="extended" style={{ boxShadow: "none" }} onClick={() => {
                        db.collection("users").doc(notificationInfo.sender).update({
                            friendRequestSent: firebase.firestore.FieldValue.arrayRemove(user.displayName)
                        });
                        db.collection("users").doc(user.displayName).update({
                            friendRequestReceived: firebase.firestore.FieldValue.arrayRemove(notificationInfo.sender)
                        });
                        db.collection("users").doc(notificationInfo.sender).collection("notifications").doc(notificationInfo.sender).update({
                            notifications: firebase.firestore.FieldValue.arrayUnion({
                                type: "friendRequestRejected",
                                sentAt: firebase.firestore.Timestamp.now(),
                                sender: user.displayName,
                                icon: user.photoUrl
                            })
                        })
                        db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}>

                        <CloseIcon style={{ marginRight: "10px" }} />
                        <b>Reject</b>
                    </Fab>
                </CardActions>
            </Card>
        }
        else if (notificationInfo.type === "friendRequestAccepted") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar src={notificationInfo.icon} />}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/user/${notificationInfo.sender}`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b> accepted your friend request.</></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "friendRequestRejected") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar src={notificationInfo.icon} />}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/user/${notificationInfo.sender}`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b> rejected your friend request.</></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "friendRequestRemoved") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar src={notificationInfo.icon} />}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/user/${notificationInfo.sender}`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b> unfriended you.</></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "comment") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar className={classes.green}><CommentIcon fontSize="small" /></Avatar>}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/post/${notificationInfo.postId}`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b> commented <b>{notificationInfo.comment}</b> on your post titled <b>{notificationInfo.postTitle}</b></></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "rating" || notificationInfo.type === "challengeRating") {
            var stars = "";
            for (var i = 0; i < notificationInfo.stars; i++) {

                stars += "★"
            }
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar src={notificationInfo.icon} />}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(notificationInfo.type === "challengeRating"?`/challenges/${user.displayName}`:`/post/${notificationInfo.postId}`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b> gave <b style={{ color: "gold" }}>{stars}</b> to your post titled <b>{notificationInfo.postTitle}</b>!</></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "chat") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar src={notificationInfo.icon} />}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/chatRoom`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b>  sent a new message</></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "groupChat") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar src={notificationInfo.icon} />}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/chatRoom`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b> sent a new message in a group chat</></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "leaguePromote") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar className={classes.green}><TrendingUpIcon fontSize="small" /></Avatar>}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/leaderboards/globalUsersLeaderBoard`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><>{notificationInfo.message}<b>{notificationInfo.league}</b></></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "leagueDemote") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar className={classes.red}><TrendingDownIcon fontSize="small" /></Avatar>}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/leaderboards/globalUsersLeaderBoard`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><>{notificationInfo.message}<b>{notificationInfo.league}</b></></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
        else if (notificationInfo.type === "challengeInivitation") {
            return <Card style={{ marginBottom: "20px" }} >

                <CardHeader

                    avatar={<Avatar className={classes.blue}><WhatshotIcon fontSize="small" /></Avatar>}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("challenges").doc(notificationInfo.challengeTitle).update({
                                    invitees: firebase.firestore.FieldValue.arrayRemove(user.displayName)
                                });
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div><><b>{notificationInfo.sender}</b> invited you to a challenge titled <b>{notificationInfo.challengeTitle}</b></></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />

                <CardActions>
                    <Fab variant="extended" style={{ boxShadow: "none" }} onClick={() => {
                        setMessage(`You are part of ${notificationInfo.challengeTitle}!`)
                        setOpen(true);
                        db.collection("challenges").doc(notificationInfo.challengeTitle).update({
                            invitees: firebase.firestore.FieldValue.arrayRemove(user.displayName),
                            participants: firebase.firestore.FieldValue.arrayUnion({ name: user.displayName, photoUrl: user.photoUrl })
                        });


                        db.collection("users").doc(notificationInfo.sender).collection("notifications").doc(notificationInfo.sender).set({
                            notifications: firebase.firestore.FieldValue.arrayUnion({
                                type: "challengeAccepted",
                                sentAt: firebase.firestore.Timestamp.now(),
                                sender: user.displayName,
                                title: notificationInfo.challengeTitle
                            })
                        }, { merge: true })


                        db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })

                        
                    }}>

                        <CheckIcon style={{ marginRight: "10px" }} />
                        <b>Accept</b>
                    </Fab>
                    <Fab variant="extended" style={{ boxShadow: "none" }} >
                        <BlockIcon style={{ marginRight: "10px" }} />
                        <b>Ignore</b>
                    </Fab>
                </CardActions>
            </Card>
        }
        else if (notificationInfo.type === "challengeAccepted") {
            return <Card style={{ marginBottom: "20px", cursor: "pointer" }} >

                <CardHeader

                    avatar={<Avatar className={classes.green}><WhatshotIcon fontSize="small" /></Avatar>}
                    action={
                        <>
                            <IconButton aria-label="close" color="inherit" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: notifications.filter(a => a !== notificationInfo)
                                }, { merge: true })
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    }
                    title={<div onClick={() => {
                        history.push(`/challenges/${user.displayName}`); db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                            notifications: notifications.filter(a => a !== notificationInfo)
                        }, { merge: true })
                    }}><><b>{notificationInfo.sender}</b> has accepted the invite for your challenge titled <b>{notificationInfo.title}</b>!</></div>}
                    subheader={moment(notificationInfo.sentAt.toDate()).fromNow()}
                />
            </Card>
        }
    }

    function objToDate(obj) {
        let result = new Date(0);
        result.setSeconds(obj.seconds);
        result.setMilliseconds(obj.nanoseconds / 1000000);
        return result;
    }



    return (
        <List className={classes.root}>

            {<FlipMove style={{ marginBottom: "70px" }}
                staggerDurationBy="50"
                duration={500}
            >
                {
                    notifications.length ?
                        <>
                            <center><h1>Notifications</h1></center>
                            {notifications.sort((a, b) => {
                                let bd = objToDate(b.sentAt);
                                let ad = objToDate(a.sentAt);
                                return bd - ad
                            }).map(displayFunction)}
                            <Fab className={classes.fab} variant="extended" color="primary" onClick={() => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: []
                                }, { merge: true })
                            }}>
                                <b>Clear All</b>
                                <ClearAllIcon className={classes.extendedIcon} />
                            </Fab>
                        </>
                        :
                        <center><h1>No New Notifications!</h1></center>
                }
            </FlipMove>
            }
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </List>
    )
}