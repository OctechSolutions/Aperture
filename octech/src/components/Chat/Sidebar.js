import React, {useState, useEffect} from 'react';
import db from "./firebase";
import './Sidebar.css';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CreateIcon from '@material-ui/icons/Create';
import SidebarOption from './SidebarOption';
import CommentIcon from '@material-ui/icons/Comment';
// import ExpandLessIcon from '@material-ui/icons/ExpandLess';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {useHistory} from 'react-router-dom';


function Sidebar() {

    //History hook
    const history = useHistory();

    //setting up groupChats as a variable
    const [groupChats, setGroupChats] = useState([]);

    /*useEffect will act as a listener and run the code
    one time once the sidebar component loads.*/
    useEffect(() => {

        // Looks at the db and imports the groupChats collection.
        // Then uses onSnapshot to take a snapshot of the db
        db.collection('groupChats').onSnapshot(snapshot => (
            setGroupChats(

                /* It will then use 'doc' to iterate through the data
                in the document/documents in the collection.
                Whenever it detects a change it will take another snapshot
                and update with the new data.*/
                snapshot.docs.map(doc=>({
                    id: doc.id,
                    name: doc.data().name

                }))
            )
        )
        );
    }, [])

    //For creating a Group Chat
    const addGroupChat = () => {

        const groupChatName = prompt('Please Enter a Name')
    //Adding the entered name to the db
        if (groupChatName) {
            db.collection("groupChats").add({
                name: groupChatName,
            })
        }
    };
    
    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <div className="sidebar_info">
                    <h2>Aperture Chats</h2>
                    <h3>{/* Mohamed Elfarash <FiberManualRecordIcon/> */}</h3>
                </div>
                <CreateIcon/>
            </div>
            <SidebarOption Icon={CommentIcon} title="Chats"/>
            {/* <SidebarOption title="Mike"/>
            <SidebarOption title="Wazowski"/>
            <hr />
            <SidebarOption Icon={ExpandLessIcon} title="Show less"/>
            <hr />
            <SidebarOption Icon={ExpandMoreIcon} title="Group Chats"/> */}
            <hr />
            <SidebarOption Icon={AddCircleOutlineIcon} title="New Group Chat"  onClick={addGroupChat}/>
            {/* Connect to dB and list all the channels aka Group Chats*/}
            {/*<SidebarOption again and again. Once we connect to the dB,
            it maps through the dB getting everything...*/}
            {groupChats.map((groupChat, i) => (
                <SidebarOption key={i} title={groupChat.name}
                id={groupChat.id} onClick={() => {history.push('/groupChat/' + groupChat.id)}} />
            ))}
        </div>
    )
}

export default Sidebar