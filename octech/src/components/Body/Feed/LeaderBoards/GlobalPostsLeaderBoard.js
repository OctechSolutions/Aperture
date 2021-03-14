import React, { useState } from 'react';
import { db } from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';


function GlobalPostsLeaderBoard() {

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  if (dataFetched === false) {

    db.collection('posts')
      .orderBy('totalStars', 'desc')
      .limit(10)
      .onSnapshot(data => {
        setDataFetched(true);
        setLeaderBoardData(data.docs.map(post => {
          return post.data();

        }));
      })
  }


  return (

    <LeaderBoardComponent title="Global Posts LeaderBoard" headers={['Post Caption', 'Posted By', 'Total Stars']} columns={['message', 'name', 'totalStars']} data={leaderboardData} />

  )
}

export default GlobalPostsLeaderBoard;