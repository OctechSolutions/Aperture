import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom';
import Feed from '../components/Body/Feed/Feed';
import Header from '../components/Header/Header';
import Notifications from '../components/Notifications/Notifications';
import Profile from '../components/userProfile/Profile';
import Collection from '../components/Collection/Collection';
import Forums from "../components/Body/Forums/FeedbackForum/Forums";
import LeaderBoards from "../components/Body/Feed/LeaderBoards/LeaderBoards";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../features/userSlice"
import HomeIcon from '@material-ui/icons/Home'
// import PersonIcon from '@material-ui/icons/Person'
import WhatshotIcon from '@material-ui/icons/Whatshot'
import Explore from '../components/Explore/Explore'
import ChatIcon from '@material-ui/icons/Chat'
import chatRoom from '../components/ChatRoom/Chatroom'
import ChallengesPage from './ChallengesPage'
import ForumIcon from "@material-ui/icons/Forum";
// import EqualizerIcon from '@material-ui/icons/Equalizer';
import { db, auth } from "../firebase";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import LaunchIcon from '@material-ui/icons/Launch';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CommentIcon from '@material-ui/icons/Comment';
import { blue, green, red } from '@material-ui/core/colors';
import moment from 'moment';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import EditProfile from '../components/userProfile/EditProfile';
import BugReportForm from '../components/Body/Feed/Reports/BugReportForm';
import PostView from '../components/Body/Post/PostView';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import ChallengeLeaderBoard from '../components/Challenge/ChallengeLeaderBoard';

const useStyles = makeStyles({
    root: {
        width: "100vw",
        height: "60px",
        position: "fixed",
        bottom: 0,
        // display: "flex",
        borderTop: "0.1px solid lightgray",
        zIndex: 99,
        borderTopLeftRadius: "30px",
        borderTopRightRadius: "30px"
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
})

export default function NewsfeedPage(props) {
    const history = useHistory()
    const classes = useStyles()
    const user = useSelector(selectUser) // Select current user from slice
    const [value, setValue] = useState("")
    const [hasNotifications, setHasNotifications] = useState(0)
    const [notifications, setNotifications] = useState([])
    const [lastNotification, setLastNotification] = useState("")
    const [icon, setIcon] = useState(<></>)
    const [time, setTime] = useState("")

    const handleChange = (event, newValue) => {
        console.log(newValue)
        setValue(newValue)
        history.push(`/${newValue}`)
    }

    const [openNotification, setOpenNotification] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
    };

    useEffect(() => {
        if (props.isVerified) {
            db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).onSnapshot(doc => {
                if (doc.exists) {

                    setHasNotifications(doc.data().notifications.length)
                    setNotifications(doc.data().notifications)
                    if (hasNotifications !== doc.data().notifications.length) {

                        setOpenNotification(Boolean(doc.data().notifications.length))
                        if (Boolean(doc.data().notifications.length) && window.location.pathname !== "/notifications" && window.location.pathname !== "/chatRoom") {
                            const notificationInfo = doc.data().notifications[doc.data().notifications.length - 1]
                            setTime(moment(notificationInfo.sentAt.toDate()).fromNow())
                            if (notificationInfo.type === "friendRequestSent") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> sent you a friend request.</>)
                                setIcon(<Avatar src={notificationInfo.icon} />)
                            }
                            else if (notificationInfo.type === "friendRequestAccepted") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> accepted your friend request.</>)
                                setIcon(<Avatar src={notificationInfo.icon} />)
                            }
                            else if (notificationInfo.type === "friendRequestRejected") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> rejected your friend request.</>)
                                setIcon(<Avatar src={notificationInfo.icon} />)
                            }
                            else if (notificationInfo.type === "friendRequestRemoved") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> unfriended you.</>)
                                setIcon(<Avatar src={notificationInfo.icon} />)
                            }
                            else if (notificationInfo.type === "comment") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> commented <b>{notificationInfo.comment}</b> on your post titled <b>{notificationInfo.postTitle}</b></>)
                                setIcon(<Avatar className={classes.green}><CommentIcon fontSize="small" /></Avatar>)
                            }
                            else if (notificationInfo.type === "rating" || notificationInfo.type === "challengeRating") {
                                var stars = "";
                                for (var i = 0; i < notificationInfo.stars; i++) {
                                    stars += "★"
                                }
                                setLastNotification(<><b>{notificationInfo.sender}</b> gave <b style={{ color: "gold" }}>{stars}</b> to your post titled <b>{notificationInfo.postTitle}</b></>)
                                setIcon(<Avatar src={notificationInfo.icon} />)
                            }
                            else if (notificationInfo.type === "chat") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> sent a new message</>)
                                setIcon(<Avatar src={notificationInfo.icon} />)
                            }
                            else if (notificationInfo.type === "groupChat") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> sent a new message in a group chat</>)
                                setIcon(<Avatar src={notificationInfo.icon} />)
                            }
                            else if (notificationInfo.type === "leaguePromote") {
                                setLastNotification(<>{notificationInfo.message}<b>{notificationInfo.league}</b></>)
                                setIcon(<Avatar className={classes.green}><TrendingUpIcon fontSize="small" /></Avatar>)
                            }
                            else if (notificationInfo.type === "leagueDemote") {
                                setLastNotification(<>{notificationInfo.message}<b>{notificationInfo.league}</b></>)
                                setIcon(<Avatar className={classes.red}><TrendingDownIcon fontSize="small" /></Avatar>)
                            }
                            else if (notificationInfo.type === "challengeInivitation") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> invited you to a challenge titled <b>{notificationInfo.challengeTitle}</b></>)
                                setIcon(<Avatar className={classes.blue}><WhatshotIcon fontSize="small" /></Avatar>)
                            }
                            else if (notificationInfo.type === "challengeAccepted") {
                                setLastNotification(<><b>{notificationInfo.sender}</b> has accepted the invite for your challenge titled <b>{notificationInfo.challengeTitle}</b>!</>)
                                setIcon(<Avatar className={classes.green}><WhatshotIcon fontSize="small" /></Avatar>)
                            }
                            
                        }
                        else if (window.location.pathname !== "/notifications") {
                            db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).get().then((doc) => {
                                db.collection("users").doc(user.displayName).collection("notifications").doc(user.displayName).set({
                                    notifications: doc.data().notifications.filter(a => (a.type === "chat") || (a.type === "groupChat") ? false : true)
                                }, { merge: true })
                            });
                        }
                        else {
                            setOpenNotification(false)
                        }
                    }
                    // else {
                    //     setOpenNotification(false)
                    // }
                }
                else {
                    setOpenNotification(false)
                }
            })
        }
    }, [user.displayName, classes.green, hasNotifications, props.isVerified, classes])

    return (
        <>
            {
                props.isVerified ?
                    (
                        <div className="app">
                            <Header setValue={setValue} hasNotifications={hasNotifications} /> {/* The header is always rendered if the user is logged in */}

                            <Route path="/" exact component={Feed} />
                            <Route path="/user/:id" exact component={Profile} /> {/* Dynamically generated user pages, the user lands on /user/{username} when clicking on someone profile, the profile page of the user is rendered by the profile component */}
                            <Route path="/user/:id/:collection" exact component={Collection} />
                            <Route path="/search" exact component={Explore} />
                            <Route path="/chatRoom" exact component={chatRoom} />
                            <Route path="/user/:id/channel/:channel" exact component={Feed} />
                            <Route path="/challenges/:id" exact component={ChallengesPage} />
                            <Route path="/forums" render={props => <Forums setValue={setValue} />} />
                            <Route path="/leaderBoards" render={props => <LeaderBoards setValue={setValue} />} />
                            <Route path="/challengeLeaderboard/:name" exact component ={ChallengeLeaderBoard} />
                            <Route path="/bugReportForm" render={props => <BugReportForm setValue={setValue} />} />
                            <Route path="/notifications" exact render={props => <Notifications notifications={notifications} />} />
                            <Route path="/editprofile"><EditProfile/></Route>
                            <Route path="/post/:id" exact component={PostView} />
                            <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
                                <BottomNavigationAction label="Home" value="" icon={<HomeIcon />} />
                                {/* <BottomNavigationAction label="Search" value="search" icon={<SearchIcon />} /> */}
                                <BottomNavigationAction label="Chat" value='chatRoom' icon={<ChatIcon />} />
                                <BottomNavigationAction label="Forums" value="forums/feedbackForum" icon={<ForumIcon />} />
                                {/* <BottomNavigationAction label="Leaderboards" value="leaderboards/globalUsersLeaderBoard" icon={<EqualizerIcon />} /> */}
                                {/* <BottomNavigationAction label="Notifications" value="notifications" icon={<NotificationsIcon />} /> */}
                                {/* <BottomNavigationAction label="Profile" value={'user/' + user.displayName} icon={<PersonIcon />} /> */}
                                <BottomNavigationAction label="Challenges" value={'challenges/' + user.displayName} icon={<WhatshotIcon />} />
                            </BottomNavigation>
                        </div>
                    ) :
                    (
                        <Modal show={auth.currentUser!==null && auth.currentUser.isVerified===false}>
                            <Modal.Body>
                                <Alert variant='info'>
                                    <div className="verify-email">
                                        <h2>
                                            You have been sent a verification e-mail.
                                        </h2>
                                    </div>
                                </Alert>
                            </Modal.Body>
                            <Modal.Footer>
                                <Alert variant='info'>
                                    <h4>Please verify and reload page to proceed.</h4>
                                </Alert>
                            </Modal.Footer>
                        </Modal>

                    )
            }
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={openNotification}
                autoHideDuration={10000}
                onClose={handleClose}
                children={
                    <>
                        <Card>
                            <CardHeader
                                avatar={icon}
                                action={
                                    <>
                                        <IconButton aria-label="close" color="inherit" onClick={() => { handleClose(); history.push("/notifications") }}>
                                            <LaunchIcon />
                                        </IconButton>
                                        <IconButton aria-label="close" color="inherit" onClick={handleClose}>
                                            <CloseIcon />
                                        </IconButton>
                                    </>
                                }
                                title={lastNotification}
                                subheader={time}
                            />
                        </Card>
                    </>
                }
                style={{ top: "75px", marginLeft: "auto" }}
            />
        </>
    )
}
