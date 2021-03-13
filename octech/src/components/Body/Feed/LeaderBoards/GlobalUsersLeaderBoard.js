import React, { useState } from 'react';
import {db} from '../../../../firebase';
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
          let counter = 0;
          setLeaderBoardData(data.docs.map(user => {
            if(counter === 0 ){
              if(user.data().league !== "Champion")
                db.collection("users").doc(user.data().name).update({league : "Champion", notifyLeague: true, leagueStatus: "p"})
              counter++;}
              else if(counter>0 && counter < 10){//It should be 100 but for demo purpose keep it 10
                if(user.data().league !== "Legendary")
                  db.collection("users").doc(user.data().name).update({league : "Legendary", notifyLeague: true, leagueStatus: user.data().league === "Champion" ? "d" : "p" })
                counter++;
              }
            return user.data();
          }));
        })
    }

  return (
    <LeaderBoardComponent title="Global Users LeaderBoard" headers={['Name','Profile Points']} columns={['name', 'profilePoints']} data={leaderboardData} />
  )
}

export default GlobalUsersLeaderBoard;