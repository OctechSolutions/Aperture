import React from 'react';
import { useHistory } from 'react-router-dom';
import './SidebarOption.css';

function SidebarOption({Icon, title, id, onClick, addGroupChatOption}) {

    const history = useHistory();
//For selecting a Group Chat
    const selectGroupChat = () => {
        if (id) {
            history.push(`/groupChat/${id}`);
        } else {
            history.push(title);
        }
    };

    
    return (
        //For creating a groupChat: If you click and you have addGroupChat option then, use
        //addGroupChatOption. otherwise use selectGroupChatOption for selecting a groupChat
        <div className="sidebarOption" onClick={onClick}>
            {/* Only render an Icon if an icon exists*/}
            {Icon && <Icon className="sidebarOption_icon"/>}
            {Icon ? (<h3>{title}</h3>) : (
            <h3 className="sidebarOption_groupChat">
            <span className="SidebarOption_hash">#</span> {title} </h3>)}
        </div>
    )
}

export default SidebarOption