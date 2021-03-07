import React, { useEffect, useState, useRef } from "react";
import { db } from "../../../firebase";
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import firebase from "firebase";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import ClearIcon from '@material-ui/icons/Clear';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import Modal from 'react-bootstrap/Modal';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const Chat = (props) => {
    let selectedUsers = []
    const [userNames, setUserNames] = useState(props.participants.map(user => user.name))
    const [message, setMessage] = useState("")
    const [add, setAdd] = useState(false)
    let query = db.collection("chatRooms").doc(props.id).collection("messages").orderBy("sentAt", "desc").limit(10)
    const [messages] = useCollectionData(query, { idField: 'id' })

    //For scroll effect
    const helper = useRef();
    useEffect(() => {
        helper.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    const sendMessage = async (e) => {
        setMessage("");
        await db.collection("chatRooms").doc(props.id).collection("messages").add({
            text: message,
            sentAt: firebase.firestore.FieldValue.serverTimestamp(),
            sender: props.user
        })

    }

    const delteMessage = async (message) => {
        await db.collection("chatRooms").doc(props.id).collection("messages").doc(message.id).delete()
    }
    const addUsers = async (users) => {
        setUserNames(userNames.concat(users.map(user => user.name)))
        setAdd(false)
        await db.collection("chatRooms").doc(props.id).update({
            participants: firebase.firestore.FieldValue.arrayUnion(...users)
        });
        await db.collection("chatRooms").doc(props.id).update({
            participantNames: firebase.firestore.FieldValue.arrayUnion(...users.map(user => user.name))
        });

    }

    return (
        <>
            <div style={{ width: "100%", position: "sticky", top: "85px", display: "flex", justifyContent : "space-between" }}>
                <p style= {{marginLeft: "2px", fontSize: "20px"}}> Chatting with {userNames.join(", ")}</p>
                <span style ={{display: "flex"}}>
                        <IconButton aria-label="add" onClick={() => { setAdd(true) }}>
                            <AddIcon />
                        </IconButton>
                        <IconButton aria-label="clear" onClick={props.clear}>
                            <ClearIcon />
                        </IconButton>
                </span>
            </div>
            <Divider />
            <Modal
                show={add}
                onHide={() => { setAdd(false) }}
                keyboard={false}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    {
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
                            options={props.friends ? props.friends.filter(user => !userNames.includes(user.name)) : []}
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
                                                    onClick={() => {
                                                        if (selectedUsers.length > 0) {
                                                            addUsers(selectedUsers);
                                                        }
                                                    }}
                                                    onMouseDown={() => { }}
                                                    edge="end"
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </InputAdornment>

                                    }}
                                />
                            )}
                        />
                    }
                </Modal.Body>
            </Modal>
            <div className="chat" style={{ width: "100%", height: "70%", overflow: "scroll" }}>

                <Grid container className="chatBox" direction="column-reverse" justify="space-between" style={{ listStyle: "none", padding: "5px" }}>
                    <span ref={helper}></span>
                    {
                        messages && messages.map(message => (
                            <Grid container xs={12} alignItems={(message.sender.name === props.user.name) ? "flex-end" : "flex-start"} direction="column" >
                                <Grid item key={message.id} style={{ margin: "5px 0" }} >
                                    <ListItem alignItems="center" style={{ borderRadius: "20px", backgroundColor: (message.sender.name === props.user.name) ? "white" : "lightgrey" }}>
                                        <ListItemAvatar >
                                            <Avatar src={message.sender.photoUrl} alt={message.sender.name} />
                                            <ListItemText secondary={(message.sender.name === props.user.name) ? "You" : message.sender.name} />
                                        </ListItemAvatar>
                                        <ListItemText primary={message.text} secondary={(message.sentAt) ? moment(message.sentAt.toMillis()).fromNow().toString() : ""} />
                                        {(message.sender.name === props.user.name) &&
                                            <ListItemSecondaryAction onClick={() => delteMessage(message)}>
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>}
                                    </ListItem>
                                    {/* <Divider /> */}
                                </Grid>
                            </Grid>
                        )
                        )}



                </Grid>
            </div>
            <TextField
                variant="outlined"
                margin="normal"
                name="chatBox"
                label="Message..."
                id="chatBox"
                value={message}
                onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                        // Do code here
                        sendMessage();
                    }
                }}
                InputProps=
                {{
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="comment send"
                                onClick={sendMessage}
                                onMouseDown={() => { }}
                                edge="end"
                            >
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>

                }}
                onChange={(e) => setMessage(e.target.value)}
                style={{ position: "fixed", width: "80%", bottom: "60px", marginLeft: "9%", backgroundColor: "whitesmoke" }}
            />
        </>
    )
}
export default Chat