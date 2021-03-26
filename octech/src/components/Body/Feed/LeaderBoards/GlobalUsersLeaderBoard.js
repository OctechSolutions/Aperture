import React, { useState } from 'react';
import {db} from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/userSlice';


function GlobalUsersLeaderBoard({ match, setValue }) {

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const user = useSelector(selectUser);

    if (dataFetched===false) {

      db.collection('users')
        .orderBy('profilePoints', 'desc')
        .onSnapshot(data => {
          setDataFetched(true);
          let counter = 0;
          setLeaderBoardData(data.docs.map(user => {
            if(counter === 0 ){
              if(user.data().league !== "Champion" && user.data().profilePoints !== 0)
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

    <LeaderBoardComponent title="Global Users LeaderBoard" headers={['Name','Profile Points']} columns={['name', 'profilePoints']} limit={8} data={leaderboardData} highlightColumn={'email'} highlightColumnData={user.email} />
    
  )
}

export default GlobalUsersLeaderBoard;