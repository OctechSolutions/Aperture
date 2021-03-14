import React, { useState } from 'react';
import { db } from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';


function ChallengesLeaderBoard() {

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  if (dataFetched === false) {

    db.collection('challengePosts')
      .orderBy('totalStars', 'desc')
      .limit(100)
      .onSnapshot(data => {
        setDataFetched(true);
        setLeaderBoardData(data.docs.map(post => {
          return post.data();
        }));
      })
    }
    return (

      <LeaderBoardComponent title="Challenges LeaderBoard" headers={['Post Caption', 'Submitted By', 'Total Stars']} columns={['caption','creator','totalStars']} data={leaderboardData} />

    )
  };

export default ChallengesLeaderBoard;