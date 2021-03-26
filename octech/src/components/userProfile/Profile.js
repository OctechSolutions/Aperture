import React, { useState, useEffect } from 'react';
import { db } from "../../firebase";
import FlipMove from "react-flip-move";
import Post from "../Body/Post/Post.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Channels from "../Channels/Channels";
import Tabs from "react-bootstrap/Tabs";
import Tab from 'react-bootstrap/Tab';
import Button from '@material-ui/core/Button';
import firebase from "firebase";
import Portfolio from "../Body/Portfolio/Portfolio"
import { useHistory } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Collection from '../Collection/Collection';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import GroupIcon from '@material-ui/icons/Group';
import List from '@material-ui/core/List';
import { blue, green, red, yellow } from '@material-ui/core/colors';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import BarChartIcon from '@material-ui/icons/BarChart';
import StarIcon from '@material-ui/icons/Star';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    },
    medium: {
        width: theme.spacing(5),
        height: theme.spacing(5),
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
    yellow: {
        color: '#fff',
        backgroundColor: yellow[700],
    },
}));

function Profile({ match }) {
    const history = useHistory();
    const user = useSelector(selectUser); // Select current user from slice
    const [profileInfo, setProfileInfo] = useState({}); // Stores the info of the user from the db
    const [posts, setPosts] = useState([]); // Stores the posts of the user
    const [key, setKey] = useState('posts');
    const [showFriendList, setShowFriendList] = useState(false);
    const [showFollowingList, setShowFollowingList] = useState(false);
    const [viewingUserInfo, setViewingUserInfo] = useState({});

    useEffect(() => {
        console.log(match); // match returns a lot of properties from the react router dom including the id we set for the urls of the router to be dynamic
        db.collection("users").doc(match.params.id) // We get the user from the db whose id matches the name of the user
            .onSnapshot(doc => {
                if (doc.exists) {
                    setProfileInfo(doc.data()); // profileInfo is set with the data recieved from the db
                    if (doc.data().friends.some(u => u.name === user.displayName) || (match.params.id === user.displayName)) {
                        db.collection("posts") // Posts are fetched from the db
                            .where("name", "==", match.params.id)
                            .orderBy("timestamp", "desc")
                            .onSnapshot((snapshot) =>
                                setPosts(
                                    snapshot.docs.map((doc) => ({
                                        id: doc.id,
                                        data: doc.data(),
                                    }))
                                )
                            );
                    }
                    else {
                        db.collection("posts") // Posts are fetched from the db
                            .where("name", "==", match.params.id)
                            .where("isPrivate", "==", false)
                            .orderBy("timestamp", "desc")
                            .onSnapshot((snapshot) =>
                                setPosts(
                                    snapshot.docs.map((doc) => ({
                                        id: doc.id,
                                        data: doc.data(),
                                    }))
                                )
                            );
                    }
                } else {
                    console.log("No such document!");
                }
            });
        db.collection("users").doc(user.displayName)
            .onSnapshot(snapshot => {
                if (snapshot.exists) {
                    setViewingUserInfo(snapshot.data());
                }
                else
                    console.log("No Such Document!")
            })
    }, [match, user.displayName]);


    const acceptfriendRequest = (e) => {
        db.collection("users").doc(profileInfo.name).update({
            friendRequestSent: firebase.firestore.FieldValue.arrayRemove(user.displayName),
            friends: firebase.firestore.FieldValue.arrayUnion({ name: viewingUserInfo.name, photoUrl: viewingUserInfo.photoUrl })
        });

        db.collection("users").doc(user.displayName).update({
            friendRequestReceived: firebase.firestore.FieldValue.arrayRemove(profileInfo.name),
            friends: firebase.firestore.FieldValue.arrayUnion({ name: profileInfo.name, photoUrl: profileInfo.photoUrl })
        });

        db.collection("users").doc(profileInfo.name).collection("notifications").doc(profileInfo.name).set({
            notifications: firebase.firestore.FieldValue.arrayUnion({
                type: "friendRequestAccepted",
                sentAt: firebase.firestore.Timestamp.now(),
                sender: user.displayName,
                icon: user.photoUrl
            })
        }, { merge: true })
        db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).get().then((doc) => {
            db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                notifications: doc.data().notifications.filter(a => (a.sender !== user.displayName) && (a.type !== "friendRequestSent"))
            }, { merge: true })
        });
    }
    const cancelfriendRequest = (e) => {
        db.collection("users").doc(profileInfo.name).update({
            friendRequestReceived: firebase.firestore.FieldValue.arrayRemove(user.displayName)
        });
        db.collection("users").doc(user.displayName).update({
            friendRequestSent: firebase.firestore.FieldValue.arrayRemove(profileInfo.name)
        });
        db.collection("users").doc(profileInfo.name).collection("notifications").doc(profileInfo.name).get().then((doc) => {
            db.collection("users").doc(profileInfo.name).collection("notifications").doc(profileInfo.name).set({
                notifications: doc.data().notifications.filter(a => (a.sender === user.displayName) && (a.type === "friendRequestSent") ? false : true)
            }, { merge: true })
        });
    }
    const rejectfriendRequest = (e) => {
        db.collection("users").doc(profileInfo.name).update({
            friendRequestSent: firebase.firestore.FieldValue.arrayRemove(user.displayName)
        });
        db.collection("users").doc(user.displayName).update({
            friendRequestReceived: firebase.firestore.FieldValue.arrayRemove(profileInfo.name)
        });
        db.collection("users").doc(profileInfo.name).collection("notifications").doc(profileInfo.name).update({
            notifications: firebase.firestore.FieldValue.arrayUnion({
                type: "friendRequestRejected",
                sentAt: firebase.firestore.Timestamp.now(),
                sender: user.displayName,
                icon: user.photoUrl
            })
        })
        db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).get().then((doc) => {
            db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                notifications: doc.data().notifications.filter(a => (a.sender !== user.displayName) && (a.type !== "friendRequestSent"))
            }, { merge: true })
        });
    }
    const sendfriendRequest = (e) => {
        db.collection("users").doc(profileInfo.name).update({
            friendRequestReceived: firebase.firestore.FieldValue.arrayUnion(user.displayName)
        });
        db.collection("users").doc(user.displayName).update({
            friendRequestSent: firebase.firestore.FieldValue.arrayUnion(profileInfo.name)
        });
        db.collection("users").doc(profileInfo.name).collection("notifications").doc(profileInfo.name).set({
            notifications: firebase.firestore.FieldValue.arrayUnion({
                type: "friendRequestSent",
                sentAt: firebase.firestore.Timestamp.now(),
                sender: user.displayName,
                icon: user.photoUrl
            })
        }, { merge: true })
    }

    const unfriend = (e) => {
        db.collection("users").doc(profileInfo.name).update({
            friends: firebase.firestore.FieldValue.arrayRemove({ name: viewingUserInfo.name, photoUrl: viewingUserInfo.photoUrl })
        });
        db.collection("users").doc(user.displayName).update({
            friends: firebase.firestore.FieldValue.arrayRemove({ name: profileInfo.name, photoUrl: profileInfo.photoUrl })
        });
        db.collection("users").doc(profileInfo.name).collection("notifications").doc(profileInfo.name).set({
            notifications: firebase.firestore.FieldValue.arrayUnion({
                type: "friendRequestRemoved",
                sentAt: firebase.firestore.Timestamp.now(),
                sender: user.displayName,
                icon: user.photoUrl
            })
        }, { merge: true })
    }
    const unBlock = (e) => {
        db.collection("users").doc(profileInfo.name).update({
            blockedBy: firebase.firestore.FieldValue.arrayRemove(user.displayName)
        });
        db.collection("users").doc(user.displayName).update({
            blocked: firebase.firestore.FieldValue.arrayRemove(profileInfo.name)
        });
    }
    const block = (e) => {
        db.collection("users").doc(profileInfo.name).update({
            blockedBy: firebase.firestore.FieldValue.arrayUnion(user.displayName),
            friends: firebase.firestore.FieldValue.arrayRemove({ name: viewingUserInfo.name, photoUrl: viewingUserInfo.photoUrl }),
            friendRequestSent: firebase.firestore.FieldValue.arrayRemove(user.displayName),
            friendRequestReceived: firebase.firestore.FieldValue.arrayRemove(user.displayName)
        });
        db.collection("users").doc(user.displayName).update({
            blocked: firebase.firestore.FieldValue.arrayUnion(profileInfo.name),
            friends: firebase.firestore.FieldValue.arrayRemove({ name: profileInfo.name, photoUrl: profileInfo.photoUrl }),
            friendRequestSent: firebase.firestore.FieldValue.arrayRemove(profileInfo.name),
            friendRequestReceived: firebase.firestore.FieldValue.arrayRemove(profileInfo.name)
        });
        db.collection("users").doc(profileInfo.name).collection("notifications").doc(profileInfo.name).get().then((doc) => {
            db.collection("users").doc(profileInfo.name).set({
                notifications: doc.data().notifications.filter(a => (a.sender !== user.displayName) && (a.type !== "friendRequest"))
            }, { merge: true })
        });

    }

    const setUserList = (l) =>
    (l.map(item =>
        <ListItem
            key={item.name}
            button
            onClick={() => { setShowFriendList(false); history.push(`/user/${item.name}`) }}
        >
            <ListItemAvatar>
                <Avatar src={item.photoUrl} />
            </ListItemAvatar>
            <ListItemText primary={item.name} />
        </ListItem>
    ))
    const setFollowingList = (l) =>
    (l.map(item =>
        <ListItem
            key={item.name}
            button
            onClick={() => { setShowFollowingList(false); history.push(`/user/${item.creator + "/channel/" + item.name}`) }}
        >
            <ListItemAvatar>
                <Avatar>
                    <ImageIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.name} secondary={item.creator} />
        </ListItem>
    ))
    const classes = useStyles();


    return (
        <div className="profile" style={{ color: "black", width: "100%", backgroundColor: "whitesmoke" }}>
            {(profileInfo.blocked && (profileInfo.blocked.includes(user.displayName))) ? <p>{profileInfo.name} has blocked you</p>
                :
                ((profileInfo.blockedBy && (profileInfo.blockedBy.includes(user.displayName))) ? <p>You have blocked this user! {<Button onClick={unBlock} variant="success">Unblock : {profileInfo.name}</Button>}</p>
                    :
                    <>
                        {profileInfo &&
                            <div>
                                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}><Avatar className={classes.large} src={profileInfo.photoUrl}></Avatar><h1 style={{marginLeft: "15px"}}>{profileInfo.name}</h1></div>
                                
                                {(profileInfo.friends && (profileInfo.name !== user.displayName)) &&
                                    <center>
                                        {(profileInfo.friends.some(u => u.name === user.displayName)) ?
                                            <Button onClick={unfriend} variant="contained"
                                                color="primary" style={{margin:"10px"}} startIcon={<PersonAddDisabledIcon />}>Remove friend</Button>
                                            : ((profileInfo.friendRequestReceived.includes(user.displayName)) ?
                                                (<Button onClick={cancelfriendRequest} startIcon={<CancelOutlinedIcon />} variant="contained"
                                                    color="primary" style={{margin:"10px"}}>Cancel Request</Button>)
                                                : ((profileInfo.friendRequestSent.includes(user.displayName)) ?
                                                    (<div>
                                                        <Button onClick={acceptfriendRequest} variant="contained"
                                                            color="primary" style={{margin:"10px"}} startIcon={<CheckCircleOutlineIcon />}>Accept Request</Button>
                                                        <Button onClick={rejectfriendRequest} variant="contained"
                                                            color="primary" style={{margin:"10px"}} startIcon={<CancelOutlinedIcon />}>Reject Request</Button>
                                                    </div>)
                                                    : (<Button onClick={sendfriendRequest} variant="contained"
                                                        color="primary" style={{margin:"10px"}} startIcon={<PersonAddIcon />}><b>Send friend Request</b></Button>)
                                                ))}
                                        {<Button onClick={block} variant="contained" style={{margin:"10px"}} startIcon={<BlockIcon />}><b>Block</b></Button>}
                                    </center>
                                }
                                {/* <List style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: "200px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }} >
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar className={classes.yellow}>
                                                <StarIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText secondary={<center>Profile Points</center>} primary={<center>{profileInfo.profilePoints}</center>} />
                                    </ListItem>
                                </List> */}
                                {/* <Divider variant="middle" /> */}
                                <List style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    maxWidth: "500px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }} >
                                    <ListItem button={true} onClick={() => setShowFriendList(true)}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.green}>
                                                <GroupIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText secondary={<center>Friends</center>} primary={<center>{profileInfo.friends && profileInfo.friends.length}</center>} />
                                    </ListItem>
                                    <Divider orientation="vertical" flexItem />
                                    <ListItem button={true} onClick={() => setShowFollowingList(true)}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.blue}>
                                                <PhotoLibraryIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText secondary={<center>Channels Following</center>} primary={<center>{profileInfo.followingChannels && profileInfo.followingChannels.length}</center>} />
                                    </ListItem>
                                </List>
                                <Divider variant="middle"/>
                                {profileInfo.league && <List style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    maxWidth: "500px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }} >
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar className={classes.red}>
                                                <BarChartIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText secondary={<center>League</center>} primary={<center>{profileInfo.league}</center>} />
                                    </ListItem>
                                    <Divider orientation="vertical" flexItem />
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar className={classes.yellow}>
                                                <StarIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText secondary={<center>Profile Points</center>} primary={<center>{profileInfo.profilePoints}</center>} />
                                    </ListItem>
                                </List>}
                                {/* <p onClick={() => setShowFriendList(true)}>Friends: {profileInfo.friends && profileInfo.friends.length}</p> <p onClick={() => setShowFollowingList(true)}>Channels Following: {profileInfo.followingChannels && profileInfo.followingChannels.length}</p> */}
                                {(profileInfo.friends && ((profileInfo.friends.some(u => u.name === user.displayName)) || (profileInfo.name === user.displayName))) &&
                                    <>
                                        <Modal
                                            show={showFriendList}
                                            onHide={() => { setShowFriendList(false) }}
                                            keyboard={false}
                                            size="xl"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                        >
                                            <Modal.Body>
                                                {setUserList(profileInfo.friends)}
                                            </Modal.Body>
                                        </Modal>
                                        <Modal
                                            show={showFollowingList}
                                            onHide={() => { setShowFollowingList(false) }}
                                            keyboard={false}
                                            size="xl"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                        >
                                            <Modal.Body>
                                                {setFollowingList(profileInfo.followingChannels)}
                                            </Modal.Body>
                                        </Modal>
                                    </>
                                }

                                {/* <h1>Profile Points : {profileInfo.profilePoints}</h1>
                                {(profileInfo.league ? <h1>League : {profileInfo.league}</h1> : <> </>)} */}
                            </div>}
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            style={{ position: "sticky", zIndex: 100, top: 60, backgroundColor: "whitesmoke" }}
                            fill
                        >
                            <Tab eventKey="posts" title="Posts" style={{ color: "black", width: "100%" }}>
                                {<FlipMove style={{ marginBottom: "70px", paddingLeft: "3%", paddingRight: "3%" }}>
                                    {posts.map(
                                        ({
                                            id,
                                            data: { name, description, message, photoUrl, photoBase, styleModification, comments, channelBy, hasCoordinates, lat, lng, stars, totalStars, isPrivate, timestamp, type },
                                        }) =>
                                        ( // Only the posts the current user has made are shown
                                            <Post
                                                key={id}
                                                id={id}
                                                name={name}
                                                description={description}
                                                message={message}
                                                photoUrl={photoUrl}
                                                photoBase={photoBase}
                                                styleModification={styleModification}
                                                comments={comments}
                                                channelBy={channelBy}
                                                hasCoordinates={hasCoordinates}
                                                lat={lat}
                                                lng={lng}
                                                viewingUser={user}
                                                star={stars}
                                                totalStar={totalStars}
                                                isPrivate={isPrivate}
                                                timestamp={timestamp}
                                                isForumPost={Boolean(type)}
                                            />
                                        )
                                    )}
                                </FlipMove>
                                }
                            </Tab>
                            <Tab eventKey="collections" title="Collections" style={{ color: "black", width: "100%", minHeight: "100%" }}>
                                <Collection match={match} user={user} />
                            </Tab>
                            <Tab eventKey="channels" title="Channels" style={{ color: "black", width: "100%" }}>
                                <Channels profileName={match.params.id} />
                            </Tab>
                            <Tab eventKey="portfolio" title="Portfolio" style={{ color: "black", width: "100%" }}>
                                <Portfolio match={match} user={user} />
                            </Tab>
                        </Tabs>
                    </>
                )
            }
        </div>
    )
}

export default Profile
