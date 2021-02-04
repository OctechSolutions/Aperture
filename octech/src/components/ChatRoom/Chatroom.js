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
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles({
    list: {
        width: 300,
    },
    fullList: {
        width: 'auto',
    },
});

const Chatroom = (match) => {
    const classes = useStyles();
    const user = useSelector(selectUser);
    const [chatList, setChatList] = useState([]);
    const [userData, setUserData] = useState("");
    const [chatWindow, setChatWindow] = useState("");
    const [state, setState] = React.useState({
        left: false
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
            participantNames: [user.name, participants.name],
            participants: [user, participants],
            chatStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(function (docRef) {
            id = docRef.id
        }).catch(function (error) {
            console.error("Error adding document: ", error);
        });
        return id
    }

    const deleteChat = async (chat) => {
        console.log(chat)
        const docRef = db.collection("chatRooms").doc(chat.id)
        const collectionRef = docRef.collection("messages")
        await collectionRef.get().then(docs => {
            docs.forEach(doc => {
                collectionRef.doc(doc.id).delete()
            });
        })
        await docRef.delete()
        setChatWindow("");
    }

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
        // onClick={toggleDrawer(anchor, false)}
        // onKeyDown={toggleDrawer(anchor, false)}
        >
            <Grid container className="headingContainer">
                <Grid item xs={12}>
                    <Typography className="heading" wrap="nowrap" variant="h6" > Chat with your friends</Typography>
                </Grid>
            </Grid>
            <Grid item className="chatListItem" style={{ borderRight: '1px solid grey' }}>
                <Autocomplete
                    autoComplete={true}
                    autoSelect={true}
                    clearOnEscape={true}
                    fullWidth={true}
                    autoHighlight={true}
                    onChange={(event, selectedUser) => {

                        if (selectedUser) {
                            let chat = chatList ? chatList.find(chat => chat.participantNames.includes(selectedUser.name)) : false//Already Started a chat with the friend

                            if (chat) {
                                setChatWindow(<Chat user={{ name: userData.data.name, photoUrl: userData.data.photoUrl }} participants={chat.participants} id={chat.id} clear={() => { setChatWindow("") }} />)
                            } else {
                                console.log("HAAn")
                                creatChat({ name: userData.data.name, photoUrl: userData.data.photoUrl }, selectedUser).then(id => {
                                    setChatWindow(<Chat user={{ name: userData.data.name, photoUrl: userData.data.photoUrl }} participants={[selectedUser]} id={id} clear={() => { setChatWindow("") }} />)
                                })
                            }
                            setState({
                                left: false
                            });
                        }
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
                        />
                    )}
                />
                <Divider />
                {(chatList === undefined) ? (<p style={{ textAlign: "center" }}>Search Friends and chat with them</p>) :
                    (<List>
                        <span ref={helper}></span>
                        {chatList.map(chat => (
                            <ListItem button key={chat.id} onClick={() => {
                                setChatWindow(<Chat user={{ name: userData.data.name, photoUrl: userData.data.photoUrl }} participants={chat.participants} id={chat.id} clear={() => { setChatWindow("") }} />); setState({
                                    left: false
                                });
                            }}>
                                <ListItemIcon>
                                    <Avatar alt={chat.participants[0].name} src={chat.participants[0].photoUrl} />
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
            <div className="chatroom" style={{ height: "90vh" }}>


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