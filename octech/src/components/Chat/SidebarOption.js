import React from 'react';
import { useHistory } from 'react-router-dom';
import './SidebarOption.css';
import db from "./firebase";

function SidebarOption({Icon, title, id, addGroupChatOption}) {

    const history = useHistory();
//For selecting a Group Chat
    const selectGroupChat = () => {
        if (id) {
            history.push(`/groupChat/${id}`);
        } else {
            history.push(title);
        }
    };
//For creating a Group Chat
    const addGroupChat = () => {

        const groupChatName = prompt('Please Enter the Group Chat Name')
//Adding the entered name to the db
        if (groupChatName) {
            db.collection("groupChats").add({
                name: groupChatName,
            })
        }
    };
    
    
    return (

        <div className="sidebarOption" onClick={ addGroupChat /* addGroupChatOption ? addGroupChat : selectGroupChat */}>
            {/* Only render an Icon if an icon exists*/}
            {Icon && <Icon className="sidebarOption_icon"/>}
            {Icon ? (<h3>{title}</h3>) : (
            <h3 className="sidebarOption_channel">
            <span className="SidebarOption_hash">#</span> {title} </h3>)}
        </div>
    )
}

export default SidebarOption