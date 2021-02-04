import React, { useEffect, useState } from 'react';
import "./GroupChat.css";
import { useParams, Redirect } from "react-router-dom";
import db from './firebase';
//import { Message } from '@material-ui/icons';
import Message from "./Message";
import GroupChatInput from "./GroupChatInput";

function GroupChat() {
    const { groupChatId } = useParams();
    const [groupChatDetails, setGroupChatDetails] = useState(null)
    const [groupChatMessages, setGroupChatMessages] = useState(null)

    useEffect(() => {
        //only run this if groupChats id exists
        if (groupChatId) {
            //go to the groupChats collection
            db.collection("groupChats").doc(groupChatId)
            //get a snapshot
            .onSnapshot(snapshot => (setGroupChatDetails(snapshot.data())
            ))
        }

        db.collection("groupChats").doc(groupChatId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(
              snapshot => setGroupChatMessages(snapshot.docs.map(doc => doc.data()))
        )

    }, [groupChatId]);

    // console.log(groupChatDetails);
    console.log("MESSAGES >>>", groupChatMessages);



    return (

        <div className="groupChat">
            <div className="groupChat_header">
                <div className="chat_headerLeft">
                {/* <h1>Chat Box</h1> */}
                {/* <hr /> */}
                    <h4 className="groupChat_groupChatName">
                       <strong>#{groupChatDetails?.name}</strong>
                    </h4>  
                </div>

                <div className="chat_headerRight">
                <p>
                    Chat Box
                </p>
                </div>    
            

            <div className="groupChat_messages">
            {groupChatMessages ? groupChatMessages.map(({message, timestamp, user, userImage}) =>
                (   <Message
                    message={message}
                    timestamp={timestamp}
                    user={user}
                    userImage={userImage}
                    />
                )) : ''}
            </div>
        </div>
            <GroupChatInput groupChatName={groupChatDetails?.name} groupChatId={groupChatId} />
        </div>
    );
};

export default GroupChat;