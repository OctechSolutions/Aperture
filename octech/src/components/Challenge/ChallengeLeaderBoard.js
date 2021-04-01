import React, { useState } from 'react';
import { db } from '../../firebase';
import LeaderBoardComponent from '../Body/Feed/LeaderBoards/LeaderBoardComponent';
import Tabs from "react-bootstrap/Tabs";
import Tab from 'react-bootstrap/Tab';

  
function ChallengeLeaderBoard({match}) {

  const [key, setKey] = useState("");
  const [userLeaderboardData, setUserLeaderBoardData] = useState("");
  const [postLeaderboardData, setPostLeaderBoardData] = useState("");
  const getData = (key) =>{
    if(key === "postLeaderBoard") {
      //Fetching the data from firebase
      db.collection('challengePosts')
      .where('challenge', '==', match.params.name)
      .orderBy('totalStars', 'desc')
      .limit(10).get()
      .then(posts => {
          let rank = 1
          setPostLeaderBoardData(posts.docs.map(post =>{ return {...post.data(),rank: rank++}}))
      })}
    else {
      db.collection('challenges').doc(match.params.name)
      .get().then(challenge => {
        let rank = 1
        setUserLeaderBoardData(challenge.data().participants.map(user =>{ return {name:user.displayName,photoUrl:user.photoUrl,email:user.email,challengePoints:user.challengePoints,rank: rank++}}))
    });}
    setKey(key)
  }  
  return (
    <div className="container-fluid" style= {{marginBottom: "60px"}}>
      <Tabs
          id="controlled-tab-example"
          activeKey={key?key :getData("userLeaderBoard") }
          onSelect={(k) => getData(k)}
          style={{ position: "sticky", zIndex: 100, top: 60, backgroundColor: "whitesmoke", width: "100%" }}
          variant={"pills"}
          fill>
          <Tab eventKey="userLeaderBoard" title="Users" style={{ color: "black", width: "100%" }}>
              <LeaderBoardComponent title="Global Users LeaderBoard" headers={['Name','Challenge Points']} columns={['name', 'challengePoints']} data={userLeaderboardData} />
          </Tab>
          <Tab eventKey="postLeaderBoard" title="Posts" style={{ color: "black", width: "100%" }}>
              <LeaderBoardComponent key={1} title={match.params.name + " LeaderBoard"} headers={['Post Caption', 'Submitted By', 'Total Stars']} columns={['caption', 'creator', 'totalStars']} data={postLeaderboardData} />   
          </Tab>
      </Tabs>
  </div>
  )
  }
  export default ChallengeLeaderBoard;
