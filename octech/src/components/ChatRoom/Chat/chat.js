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
import GroupIcon from '@material-ui/icons/Group';
import List from '@material-ui/core/List';
import { useHistory } from "react-router-dom";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import RemoveIcon from '@material-ui/icons/Remove';
import { Link } from "react-router-dom";
import Tooltip from '@material-ui/core/Tooltip';

const Chat = (props) => {
    const history = useHistory();
    let selectedUsers = []
    const [users, setUsers] = useState(props.participants)
    const [message, setMessage] = useState("")
    const [add, setAdd] = useState(false)
    const [showUsers, setShowUsers] = useState(false)
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
    const addUsers = async (userS) => {
        setUsers(users.concat(userS))
        setAdd(false)
        await db.collection("chatRooms").doc(props.id).update({
            participants: firebase.firestore.FieldValue.arrayUnion(...userS)
        });
        await db.collection("chatRooms").doc(props.id).update({
            participantNames: firebase.firestore.FieldValue.arrayUnion(...userS.map(user => user.name))
        });

    }
    const removeUser = async (user) => {
        setUsers(users.filter(u => user.name != u.name))
        setShowUsers(false)
        await db.collection("chatRooms").doc(props.id).update({
            participants: firebase.firestore.FieldValue.arrayRemove(user)
        });
        await db.collection("chatRooms").doc(props.id).update({
            participantNames: firebase.firestore.FieldValue.arrayRemove(user.name)
        });

    }

    return (
        <>
            <div style={{ width: "100%", position: "sticky", top: "85px", display: "flex", justifyContent: "space-between" }}>
                <div style={{ marginLeft: "2px", fontSize: "20px" }}> {(users.length > 1) ?
                    <AvatarGroup max={10}>
                        {props.participants.map(user => (user.photoUrl) ? <Avatar alt={user.name} src={user.photoUrl} /> : "")}
                    </AvatarGroup>
                    : <>
                        {/* <ListItemIcon> */}
                        <IconButton disableRipple={true} disableFocusRipple={true} disableTouchRipple={true} style={{ backgroundColor: "transparent" }}>
                            <AvatarGroup max={3} style={{marginRight: "5px"}}>
                                {props.participants.map(user => (user.photoUrl) ? <Avatar alt={user.name} src={user.photoUrl} /> : "")}
                            </AvatarGroup>
                            <div>{props.participants.map(user => user.name)}</div>
                            {/* <ListItemText primary={props.participants.map(user => user.name)} primaryTypographyProps={{ noWrap: true }}></ListItemText> */}
                        </IconButton>

                        {/* </ListItemIcon> */}

                    </>
                }
                </div>
                <span style={{ display: "flex" }}>
                    {users.length > 1 ? <IconButton edge="end" aria-label="add" onClick={() => { setShowUsers(true) }}><GroupIcon /></IconButton> : ""}
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
                show={showUsers}
                onHide={() => { setShowUsers(false) }}
                keyboard={false}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    {
                        <List component="users" aria-label="chat participants">
                           { users.map(option => (
                               <ListItem button onClick={()=>{
                                history.push(`/user/${option.name}`)
                               }}>
                                    <ListItemIcon>
                                        <Avatar alt={option.name} src={option.photoUrl} />
                                    </ListItemIcon>
                                    <ListItemText primary={option.name} secondary={props.creator === option.name ? "Creator" : "Member"} primaryTypographyProps={{ noWrap: true }} />
                                    {(props.creator === props.user.name) &&
                                        <ListItemSecondaryAction onClick={() => removeUser(option)}>
                                            <IconButton edge="end" aria-label="remove">
                                                <RemoveIcon />
                                            </IconButton>
                                    </ListItemSecondaryAction>}
                                </ListItem>
                            ))
                        }
                        </List>
                    }
                </Modal.Body>

            </Modal>
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
                            options={props.friends ? props.friends.filter(user => !users.map(u=>u.name).includes(user.name)) : []}
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
                                        <div>
                                            <div style={{ display: "flex", fontSize: "15px", color: "#303030" }}>{(message.sender.name === props.user.name) ? "You" : message.sender.name}</div>
                                            <div div style={{ display: "flex" }}>
                                                <Divider />
                                                <ListItemAvatar >
                                                    <Tooltip title={message.sender.name} placement="top">
                                                        <Link to={`/user/${message.sender.name}`}>
                                                            <Avatar src={message.sender.photoUrl} alt={message.sender.name} />
                                                        </Link>
                                                    </Tooltip>
                                                    {/* <ListItemText secondary={(message.sender.name === props.user.name) ? "You" : message.sender.name} /> */}
                                                </ListItemAvatar>
                                                <div div style={{ display: "flex" }}>
                                                    <ListItemText primary={message.text} secondary={(message.sentAt) ? moment(message.sentAt.toMillis()).fromNow().toString() : ""} />

                                                    {(message.sender.name === props.user.name) &&
                                                        <div onClick={() => delteMessage(message)}>
                                                            <IconButton edge="end" aria-label="delete">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>}
                                                </div>
                                            </div>
                                        </div>
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