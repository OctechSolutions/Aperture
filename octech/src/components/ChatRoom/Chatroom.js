import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import Chat from './Chat/chat'
import "./chatroom.css"
import Autocomplete from '@material-ui/lab/Autocomplete';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from "firebase";
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChatIcon from '@material-ui/icons/Chat';
import InputAdornment from '@material-ui/core/InputAdornment';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

const useStyles = makeStyles({
    list: {
        width: 300,
    },
    fullList: {
        width: 'auto',
    },
});
const Chatroom = (match) => {
    let selectedUsers = []
    const classes = useStyles();
    const user = useSelector(selectUser);
    const [chatList, setChatList] = useState([]);
    const [userData, setUserData] = useState("");
    const [chatWindow, setChatWindow] = useState("");
    const [state, setState] = React.useState({
        left: true
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };




    //For scroll effect
    const helper = useRef();
    useEffect(() => {
        // helper.current.scrollIntoView({ behavior: 'smooth' });

        db.collection("users").doc(user.displayName).get().then(doc => {
            if (doc.exists) {
                setUserData({
                    id: doc.id,
                    data: doc.data()
                })
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting user data:", error)
        });

        db.collection("chatRooms")
            .where("participantNames", "array-contains", user.displayName)
            .orderBy("chatStartedAt", "desc").onSnapshot(chats => {
                if (chats) {
                    let userChats = []
                    chats.forEach(chat => {
                        let data = chat.data()
                        userChats.push({
                            id: chat.id,
                            data: chat.data(),
                            participantNames: data.participantNames.filter(useR => useR !== user.displayName),
                            participants: data.participants.filter(useR => useR.name !== user.displayName),
                        })
                    });
                    setChatList(userChats);
                } else {
                    console.log("No chats for the user");
                }
            }, function (error) {
                console.log("Error getting chats:", error);
            })
    }, [user.displayName]);

    const creatChat = async (user, participants) => {
        let id = ""
        await db.collection("chatRooms").add({
            participantNames: [user.name, ...participants.map(user => user.name)],
            participants: [user, ...participants],
            chatStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(function (docRef) {
            id = docRef.id
        }).catch(function (error) {
            console.error("Error adding document: ", error);
        });
        return id
    }

    const deleteChat = async (chat) => {
        const docRef = db.collection("chatRooms").doc(chat.id)
        const collectionRef = docRef.collection("messages")
        await collectionRef.get().then(docs => {
            docs.forEach(doc => {
                collectionRef.doc(doc.id).delete()
            });
        })
        await docRef.delete().then( () =>{
            setChatWindow("")
        }
        )
    }

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            style={{margin:"20px"}}
        // onClick={toggleDrawer(anchor, false)}
        // onKeyDown={toggleDrawer(anchor, false)}
        >
            <Grid container className="headingContainer">
                <Grid item xs={12}>
                    <Typography className="heading" wrap="nowrap" variant="h6" > Chat with your friends</Typography>
                </Grid>
            </Grid>
            <Grid item className="chatListItem">
                <Autocomplete
                    multiple
                    autoComplete={true}
                    autoSelect={true}
                    clearOnEscape={true}
                    fullWidth={true}
                    autoHighlight={true}
                    onChange={(event, selectedUser) => {
                        selectedUsers = selectedUser
                    }}
                    id="search"
                    options={userData ? userData.data.friends : []}
                    getOptionLabel={option => option.name}
                    renderOption={(option) => {
                        return (
                            <ListItem >
                                <ListItemIcon>
                                    <Avatar alt={option.name} src={option.photoUrl} />
                                </ListItemIcon>
                                <ListItemText primary={option.name} primaryTypographyProps={{ noWrap: true }} />
                            </ListItem>
                        )
                    }
                    }
                    disableClearable
                    forcePopupIcon={false}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search"
                            margin="normal"
                            variant="outlined"
                            style={{
                                position: "sticky",
                                zIndex: 100,
                                top: 200,
                                backgroundColor: "white",
                                marginBottom: "20px"
                            }}
                            InputProps=
                            {{
                                ...params.InputProps,
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="start chat"
                                            onClick={(event,value)=>{
                                                if (selectedUsers.length>0) {
                                                    let chat = chatList ? chatList.find(chat => ((chat.participantNames.length === selectedUsers.length) & (selectedUsers.every(user => chat.participantNames.includes(user.name))))) : false//Already Started a chat with the friend
                        
                                                    if (chat) {
                                                        setChatWindow(<Chat user={{ name: userData.data.name, photoUrl: userData.data.photoUrl }} participants={chat.participants} id={chat.id} clear={() => { setChatWindow("");setState({ left: true }) }} friends={userData.data.friends} />)
                                                    } else {
                                                        if(selectedUsers.length>0){
                                                            creatChat({ name: userData.data.name, photoUrl: userData.data.photoUrl }, selectedUsers).then(id => {
                                                                setChatWindow(<Chat user={{ name: userData.data.name, photoUrl: userData.data.photoUrl }} participants={selectedUsers} id={id} clear={() => { setChatWindow("") ;setState({ left: true }) }} friends={userData.data.friends}/>)
                                                            })}
                                                    }
                                                    setState({
                                                        left: false
                                                    });
                                                }
                                            }}
                                            onMouseDown={() => { }}
                                            edge="end"
                                        >
                                            <ChatIcon />
                                        </IconButton>
                                    </InputAdornment>

                            }}
                        />
                    )}
                />
                <Divider />
                {(chatList === undefined) ? (<p style={{ textAlign: "center" }}>Search Friends and chat with them</p>) :
                    (<List>
                        <span ref={helper}></span>
                        {chatList.map(chat => (
                            <ListItem button key={chat.id} onClick={() => {
                                setChatWindow(<Chat user={{ name: userData.data.name, photoUrl: userData.data.photoUrl }} participants={chat.participants} id={chat.id} clear={() => { setChatWindow("");setState({ left: true }) }} friends={userData.data.friends}/>); setState({
                                    left: false
                                });
                            }}>
                                <ListItemIcon>
                                    <AvatarGroup max={3}>
                                        {chat.participants.map(user => (user.photoUrl) ? <Avatar alt={user.name} src={user.photoUrl} /> :"" )}
                                    </AvatarGroup>
                                </ListItemIcon>
                                <ListItemText primary={chat.participantNames.join(", ")} primaryTypographyProps={{ noWrap: true }} ></ListItemText>
                                <ListItemSecondaryAction onClick={() => { deleteChat(chat) }}>
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>))}
                    </List>)}
            </Grid>
        </div>
    );

    return (
        (
            <div className="chatroom" style={{ height: "85vh" }}>


                {/* Flexbox from material Ui
                First Grid for the heading
            */}

                {['left'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={toggleDrawer(anchor, true)}
                            onMouseDown={() => { }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                        <SwipeableDrawer
                            anchor={anchor}
                            open={state[anchor]}
                            onClose={toggleDrawer(anchor, false)}
                            onOpen={toggleDrawer(anchor, true)}
                        >
                            {list(anchor)}
                        </SwipeableDrawer>
                    </React.Fragment>
                ))}

                {chatWindow}
            </div>)
    )

}
export default Chatroom;