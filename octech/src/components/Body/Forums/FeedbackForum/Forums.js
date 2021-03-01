import React, {useState, useEffect} from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from 'react-bootstrap/Tab';
import FeedbackForum from './FeedbackForum'
import GamingForum from './GamingFoum'

function Forums({ match, setValue }) {
    
    const [key, setKey] = useState(window.location.pathname.slice(8));

    useEffect(() => {
        setValue('forums/feedbackForum')
      }, [setValue]);

    return (
        
        <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            style={{ position: "sticky", zIndex: 100, top: 60, backgroundColor: "whitesmoke",width: "100%" }}
            variant={"pills"}
            fill
        >
            <Tab eventKey="feedbackForum" title="Feedback Forum" style={{ color: "black", width: "100%" }}>
                <FeedbackForum />
            </Tab>
            <Tab eventKey="gamingForum" title="Gaming Forum" style={{ color: "black", width: "100%" }}>
                <GamingForum />
            </Tab>
        </Tabs>
    )
}

export default Forums
