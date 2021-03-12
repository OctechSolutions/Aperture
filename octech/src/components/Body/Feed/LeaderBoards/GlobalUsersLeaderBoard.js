import React, { useState, useEffect } from 'react';
import {db} from '../../../../firebase';
import firebase from 'firebase';
import LeaderBoardComponent from './LeaderBoardComponent';


function GlobalUsersLeaderBoard({ match, setValue }) {
  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

    if (dataFetched===false) {
      db.collection('users')
        .orderBy('profilePoints', 'desc')
        .limit(100)
        .onSnapshot(data => {
          setDataFetched(true);
          setLeaderBoardData(data.docs.map(user => {
            return user.data();
          }));
        })
    }

  return (
    <LeaderBoardComponent title="Global Users LeaderBoard" headers={['Name','Profile Points']} columns={['name', 'profilePoints']} data={leaderboardData} />
  )
}

export default GlobalUsersLeaderBoard;