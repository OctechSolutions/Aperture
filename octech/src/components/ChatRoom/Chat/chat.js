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

const Chat = (props) => {
    const [message, setMessage] = useState("")
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
            sender: props.user.name
        })

    }

    const delteMessage = async (message) => {
        await db.collection("chatRooms").doc(props.id).collection("messages").doc(message.id).delete()
    }
    
    return (
        <>
            <div style={{ width: "100%", position: "sticky", top: "85px" }}>
                <p style={{ textAlign: "left", padding: "1px 10px" }}> Chatting with {[...props.participants.map(p => p.name)].join(", ")} <span style={{ float: "right" }}><IconButton edge="end" aria-label="clear" onClick={props.clear}><ClearIcon /></IconButton></span></p>
                <Divider />
            </div>
            <div className="chat" style={{ width: "100%", height:"70%", overflow: "scroll" }}>

                <Grid container className="chatBox" direction="column-reverse" justify="space-between" style={{ listStyle: "none", padding: "5px" }}>
                    <span ref={helper}></span>
                    {
                        messages && messages.map(message => (
                            <Grid container xs={12} alignItems={(message.sender === props.user.name) ? "flex-end" : "flex-start"} direction="column" >
                                <Grid item key={message.id} style={{ margin: "5px 0" }} >
                                    <ListItem alignItems="center" style={{ borderRadius: "20px", backgroundColor: (message.sender === props.user.name) ? "white" : "lightgrey" }}>
                                        <ListItemAvatar >
                                            <Avatar src={(message.sender === props.user.name) ? props.user.photoUrl : props.participants[0].photoUrl} alt={(message.sender === props.user.name) ? props.user.name : props.participants[0].name} />
                                            <ListItemText secondary={(message.sender === props.user.name) ? "You" : message.sender} />
                                        </ListItemAvatar>
                                        <ListItemText primary={message.text} secondary={(message.sentAt) ? moment(message.sentAt.toMillis()).fromNow().toString() : ""} />
                                        {(message.sender === props.user.name) &&
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
                style={{ position: "fixed", width: "80%", bottom: "60px", marginLeft: "9%", backgroundColor: "whitesmoke"}}
            />
        </>
    )
}
export default Chat