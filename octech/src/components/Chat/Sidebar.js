import React, {useState, useEffect} from 'react';
import db from "./firebase";
import './Sidebar.css';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CreateIcon from '@material-ui/icons/Create';
import SidebarOption from './SidebarOption';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';


function Sidebar() {

    //setting up groupChats as a variable

    const [groupChats, setGroupChats] = useState([]);


    useEffect(() => {

       
        db.collection('groupChats').onSnapshot(snapshot => (
            setGroupChats(

               
                snapshot.docs.map(doc=>({
                    id: doc.id,
                    name: doc.data().name

                }))
            )
        )
        );
    }, [])

    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <div className="sidebar_info">
                    <h2>Aperture Chats</h2>
                    <h3>Mohamed Elfarash <FiberManualRecordIcon/> </h3>
                </div>
                <CreateIcon/>
            </div>
            <SidebarOption Icon={InsertCommentIcon} title="Chats"/>
            <SidebarOption title="Mike"/>
            <SidebarOption title="Wazowski"/>
            <hr />
            <SidebarOption Icon={ExpandLessIcon} title="Show less"/>
            <hr />
            <SidebarOption Icon={ExpandMoreIcon} title="Group Chats"/>
            <hr />
            <SidebarOption Icon={AddCircleOutlineIcon} title="New Group Chat"/>
            
            {/* Connect to dB and list all the channels aka Group Chats*/}
            {/*<SidebarOption again and again. Once we connect to the dB,
            it maps through the dB getting everything...*/}
            {groupChats.map((groupChat, i) => (
                <SidebarOption key={i} title={groupChat.name}
                id={groupChat.id}/>
            )
            )}
        </div>
    )
}

export default Sidebar