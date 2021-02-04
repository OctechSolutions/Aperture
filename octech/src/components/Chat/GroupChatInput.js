import React, { useState } from 'react';
import "./GroupChatInput.css"
import db from "./firebase";
// import { useStateValue } from "./StateProvider"
import firebase from "firebase";

function GroupChatInput({groupChatName, groupChatId}) {
    const [input, setInput] = useState("");

    const sendMessage = (e) => {
        e.preventDefault();

        if (groupChatId) {
            /*
            db.collection('groupChats').doc(groupChatId).collection({
                message: input,
                timestamp: firebase.firestore.FieldValue.serverTimestamp + "",
                // Below line should be changed to 'user.displayName,'
                // once user info is brought using import useStateValue above
                user: "Display Name",
                // Below line should be changed to 'user.photoURL,'
                // once user info is brought using import useStateValue above
                userImage: <img src='https://i.pinimg.com/736x/33/32/6d/33326dcddbf15c56d631e374b62338dc.jpg' alt="" />
           
            })
            */

            db.collection('groupChats').doc(groupChatId).collection('messages')
                .add({
                    message: input,
                    timestamp: Date.now(),
                    // Below line should be changed to 'user.displayName,'
                    // once user info is brought using import useStateValue above
                    user: "Display Name",
                    // Below line should be changed to 'user.photoURL,'
                    // once user info is brought using import useStateValue above
                    userImage: 'https://i.pinimg.com/736x/33/32/6d/33326dcddbf15c56d631e374b62338dc.jpg'
                })
           }
        setInput("");
    };
    
    return (
        <div className="groupChatInput">
            <form>
                <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Message #${groupChatName?.toLowerCase()}`}/>
                <button type="submit" onClick={sendMessage}>SEND</button>
            </form>
        </div>
    );
}

export default GroupChatInput;