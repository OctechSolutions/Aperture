import React, { useEffect, useState, useRef } from "react";
import { db, storage } from "../../../firebase";
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Input from '@material-ui/core/Input';
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

const Chat = (props) =>{
  console.log(props.id)
  const [message,setMessage] = useState("")
    let query =  db.collection("chatRooms").doc(props.id).collection("messages").orderBy("sentAt","desc").limit(10)
    const [messages] = useCollectionData(query,{idField:'id'})
   
    //For scroll effect
    const helper = useRef();
    useEffect(() => {
        helper.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault(); 
        await db.collection("chatRooms").doc(props.id).collection("messages").add({
          text: message,
          sentAt: firebase.firestore.FieldValue.serverTimestamp(),
          sender: props.user.name
        }) 
        setMessage("")
      }

    const delteMessage = async (message) =>{
        console.log(message)
        await db.collection("chatRooms").doc(props.id).collection("messages").doc(message.id).delete()
    }
    return (
        <div className="chat">
            <p  style={{textAlign:"left",padding:"1px 10px"}}> Chatting with {[...props.participants.map(p=>p.name)].join(" ")} <span style={{float:"right"}}><IconButton edge="end" aria-label="clear" onClick={props.clear}><ClearIcon/></IconButton></span></p>
            <Divider/>
            <span ref={helper}></span>
            <Grid container className = "chatBox" direction="column-reverse" >
                {
                    messages && messages.map(message =>(
                        <Grid item xs={12} md={6} key ={message.id} >
                            <ListItem alignItems="center">
                                <ListItemAvatar >
                                    <Avatar src={(message.sender === props.user.name) ? props.user.photoUrl : props.participants[0].photoUrl} alt={(message.sender === props.user.name) ? props.user.name : props.participants[0].name} />
                                    <ListItemText  secondary={(message.sender === props.user.name)? "You" : "Friend"}/>
                                </ListItemAvatar>
                                <ListItemText  primary={message.text} secondary= {(message.sentAt) ? moment(message.sentAt.toMillis()).fromNow().toString():""}/>
                                {(message.sender === props.user.name) && 
                                <ListItemSecondaryAction onClick={()=>delteMessage(message)}>
                                    <IconButton edge="end" aria-label="delete">
                                     <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>}
                            </ListItem>
                            <Divider />
                        </Grid>
                    )   
                    )}
                


            </Grid>
           
            <Grid container className = "messageBox" >
                <div style={{position:"fixed",bottom:"50px",display:"flex",width:"100%",flexDirection:"row"}}>
                    <form className="messageForm" noValidate autoComplete="off" onSubmit={sendMessage}>
                        <Grid item xs={12}>
                                <Input placeholder="Enter Your Message" value={message} onChange={(e)=>setMessage(e.target.value)} inputProps={{ required:true,fullwidth:true }} />
                        <Grid xs={1} align="right">
                            <Fab color="primary" aria-label="add" onClick={sendMessage}><SendIcon/></Fab>
                        </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </div>
    )
}
export default Chat