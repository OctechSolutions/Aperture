import React, { useState, useEffect } from 'react';
import {db} from '../../../../firebase';
import firebase from 'firebase';
import LeaderBoardComponent from './LeaderBoardComponent';


function GlobalPostsLeaderBoard({ match, setValue }) {
  const [leaderboardData, setLeaderBoardData] = useState([]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('totalStars', 'desc')
      .limit(10)
      .onSnapshot(data => {
        setLeaderBoardData(data.docs.map(post => {
          return post.data();
        }));
      })

  })
  return (
    <LeaderBoardComponent title="Global Posts LeaderBoard" headers={['Post Caption', 'Posted By', 'Total Stars']} columns={['message', 'name', 'totalStars']} data={leaderboardData} />
  )
}

export default GlobalPostsLeaderBoard;