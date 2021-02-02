import React, { useEffect, useState } from "react";
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
import  "./chatroom.css"
import Autocomplete from '@material-ui/lab/Autocomplete';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';


const Chatroom = (match) => {
    const user = useSelector(selectUser);
    const [chatList,setChatList] = useState([]);
    const [userData,setUserData] = useState("");
    const [chatWindow,setChatWindow] = useState("");
    const [value,setValue] = useState("")
    const [inputValue, setInputValue] = useState('');


    useEffect(()=>{
        db.collection("users").doc(user.displayName).get().then(doc => {
            if (doc.exists) {
                setUserData({
                    id: doc.id,
                    data: doc.data()
                })
            } else {
                console.log("No such document!");
            }     
        }).catch(function(error) {
            console.log("Error getting user data:", error)}); 

        db.collection("chatRooms")
        .where("participantNames","array-contains",user.displayName)
        .orderBy("chatStartedAt","desc").onSnapshot(chats =>{
            if (chats) {
                let userChats = []
                chats.forEach(chat => {
                    let data = chat.data()
                    userChats.push({
                        id:chat.id,
                        data:chat.data(),
                        participantNames : data.participantNames.filter(useR => useR !== user.displayName),
                        participants : data.participants.filter(useR => useR.name !== user.displayName),                
                    })
                });
                setChatList(userChats);
            } else {
                console.log("No chats for the user");
            }                
        },function(error) {
            console.log("Error getting chats:", error);  
    })},[user.displayName]);

    const deleteChat = async (chat)=>{
        const docRef = db.collection("chatRooms").doc(chat.id)
        const collectionRef = docRef.collection("messages")
        await collectionRef.get().then(docs =>{
            docs.forEach(doc => {
                doc.delete()
            });
        })
        await docRef.delete()
    }

    return (
        (
            <div className = "chatroom">
            {/* Flexbox from material Ui
                First Grid for the heading
            */}
            <Grid container className="headingContainer">
                <Grid item xs={12}>
                    <Typography className="heading" wrap="nowrap" variant="h6" > Chat with your friends</Typography>
                </Grid>
            </Grid>
            <Grid container className="chatContainer">
                <Grid item className="chatListItem" xs={3} style = { {borderRight: '1px solid grey'}}>
                    <Autocomplete
                        autoComplete 
                        autoSelect
                        clearOnEscape
                        fullWidth
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {

                            setInputValue(newInputValue);
                            // const selectedUser = userData.data.friends.filter(function (item) { return item.name === newInputValue; });
                            const selectedUser = userData.data.friends.find(user => user.name === newInputValue);
                            if(selectedUser){
                                console.log(chatList)
                                let chat = chatList ? chatList.find(chat => chat.participantNames.includes(selectedUser.name)) : []//Already Started a chat with the friend
                                if(chat){
                                    setChatWindow(<Chat user = {{name:userData.data.name,photoUrl:userData.data.photoUrl}} participants={chat.participants} id = {chat.id} new={false}/>)
                                }else{
                                    setChatList(chat,...chatList)
                                    setChatWindow(<Chat user = {{name:userData.data.name,photoUrl:userData.data.photoUrl}} participants={selectedUser} new={true}  />)
                                }
                            }
                        }}
                        id="search"
                        freeSolo
                        options={(userData) ? userData.data.friends.map((user) => user.name):[]}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search for friends"
                                margin="normal"
                                variant="outlined"
                                style={{ position: "sticky", zIndex: 100, top: 200, backgroundColor: "white" }}
                            />
                        )}
                    />
                    <Divider />
                    {(chatList === undefined) ? (<p style={{textAlign:"center"}}>Search Friends and chat with them</p>):
                    (<List>
                        {chatList.map(chat =>(
                                    <ListItem button key={chat.id} onClick={()=>{setChatWindow(<Chat user = {{name:userData.data.name,photoUrl:userData.data.photoUrl}} participants={chat.participants} id = {chat.id} new={false}/>)}}>
                                        <ListItemIcon>
                                            <Avatar alt={chat.participants[0].name} src={chat.participants[0].photoUrl}/>
                                        </ListItemIcon>
                                        <ListItemText primary={chat.participantNames.join(", ")} primaryTypographyProps={{noWrap:true}} ></ListItemText>
                                        {/* <ListItemIcon onClick={()=>{deleteChat(chat)}}>
                                            <DeleteIcon/>
                                        </ListItemIcon> */}
                                    </ListItem>))}
                    </List>)}
                </Grid> 
                <Grid item xs={9} className="chatWindow">
                    {chatWindow}
                </Grid>
            </Grid>


        </div>)
    )

}
export default Chatroom;