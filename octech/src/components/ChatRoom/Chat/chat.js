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
import List from '@material-ui/core/List';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';

let messages =[]
const Chat = (props) =>{
  let query
  let id
  const [message,setMessage] = useState("")
  if (props.new){
        console.log(props.participants)
      db.collection("chatRooms").add({
          participantNames:[props.user.name,props.participants.name],
          participants:[props.user,props.participants],
          chatStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(function(docRef) {
          id =docRef.id
          query =  db.collection("chatRooms").doc(docRef.id).collection("messages").orderBy("sentAt","desc").limit(10)
        }).catch(function(error) {
          console.error("Error adding document: ", error);
        }); 
    }else {
      id =props.id
      query =  db.collection("chatRooms").doc(props.id).collection("messages").orderBy("sentAt","desc").limit(10)
    }
    
    const [messages] = useCollectionData(query,{idField:'id'})
    // if(messagess)
    //     messages = messagess.concat(messages)
    //For scroll effect
    const helper = useRef();
    useEffect(() => {
        helper.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault(); 
        await db.collection("chatRooms").doc(id).collection("messages").add({
          text: message,
          sentAt: firebase.firestore.FieldValue.serverTimestamp(),
          sender: props.user.name
        }) 
        setMessage("")
      }

    const delteMessage = async (e,message) =>{
        await db.collection("chatRooms").doc(props.id).collection("messages").doc(message.id).delete()
    }
    return (
    // <p>Hello</p>
        <div className="chat">
            {/* <p  style={{textAlign:"center"}}> Chatting with {[...props.participants.map(p=>p.name)].join(" ")}</p> */}
            <List>
                <span ref={helper}></span>
                {messages && messages.map(message =>(
                    <ListItem key={props.user.name}>
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText key ={message.id} align={(message.sender === props.user.name)?"right":"left"} primary={message.text} ></ListItemText>
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemText key ={message.text} align={(message.sender === props.user.name)?"right":"left" }secondary={(message.sentAt) ? moment(message.sentAt.toMillis()).fromNow().toString():""} ></ListItemText>
                            </Grid>
                            {/* <ListItemIcon onClick={(message)=>{delteMessage(message)}}>
                                 <DeleteIcon/>
                            </ListItemIcon> */}
                        </Grid>
                    </ListItem>
                ))}
            </List>
            <span ref={helper}></span>
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