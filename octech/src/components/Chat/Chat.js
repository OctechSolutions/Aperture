import React, { useEffect, useState } from 'react';
import "./GroupChat.css";
import { useParams } from "react-router-dom";
import db from './firebase';


function GroupChat() {
    const { groupChatId } = useParams();
    const [groupChatDetails, setGroupChatDetails] = useState(null)

    useEffect(() => {
        //only run this if groupChats id exists
        if (groupChatId) {
            //go to the groupChats collection
            db.collection("groupChats").doc(groupChatId)
            //get a snapshot
            .onSnapshot((snapshot) => setGroupChatDetails(snapshot.data())
            )
        }
    })
    return (

        <div className="groupChat">
            
            <div className="groupChat_header">
                <h2>Chat Box</h2>
                <hr />
                <div className="groupChat_headerLeft">
                    {/* <h4 className="groupChat_groupChatName">
                       <strong></strong> </h4> */}
                    {/* </div> */}
            </div>
        </div>
     </div>
    );
}

export default GroupChat