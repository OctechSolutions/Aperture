import React, { useState, useEffect } from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from 'react-bootstrap/Tab';
import GlobalUsersLeaderBoard from './GlobalUsersLeaderBoard';
import GlobalPostsLeaderBoard from './GlobalPostsLeaderBoard';
import ChallengesLeaderBoard from './ChallengesLeaderBoard';
// import TabContent from 'react-bootstrap/TabContent';

function Forums({ match, setValue }) {

    const [key, setKey] = useState(window.location.pathname.slice(14));

    useEffect(() => {
        setValue('leaderBoards/globalUsersLeaderBoard')
        console.log(match);
    }, [setValue]);

    return (
        <div className="container-fluid" style= {{marginBottom: "60px"}}>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                style={{ position: "sticky", zIndex: 100, top: 60, backgroundColor: "whitesmoke", width: "100%" }}
                variant={"pills"}
                fill>
                <Tab eventKey="globalUsersLeaderBoard" title="Users" style={{ color: "black", width: "100%" }}>
                    <GlobalUsersLeaderBoard />
                </Tab>
                <Tab eventKey="globalPostsLeaderBoard" title="Posts" style={{ color: "black", width: "100%" }}>
                    <GlobalPostsLeaderBoard />
                </Tab>
                <Tab eventKey="challengesLeaderBoard" title="Challenges" style={{ color: "black", width: "100%" }}>
                    <ChallengesLeaderBoard />
                </Tab>
            </Tabs>
        </div>
    )
}

export default Forums