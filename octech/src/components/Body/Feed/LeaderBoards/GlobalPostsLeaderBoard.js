import React, { useState } from 'react';
import { db } from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';


function GlobalPostsLeaderBoard() {

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  if (dataFetched === false) {
    //Fetching the data for the posts from firebase
    db.collection('globalLeaderBoards').doc('postLeaderBoard').get().then(data => {
        setDataFetched(true);
        if(data.data())
          setLeaderBoardData(data.data().posts.map(post => {
            return post.data;
          }));
      })
  }

  return (
    //Assigning the columns of data to be displayed
    <LeaderBoardComponent title="Global Posts LeaderBoard" headers={['Post Caption', 'Posted By', 'Total Stars']} columns={['message', 'name', 'totalStars']} data={leaderboardData} />

  )
}

export default GlobalPostsLeaderBoard;