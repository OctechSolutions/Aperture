import React, { useState } from 'react';
import {db} from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';
import firebase from "firebase";


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
            if(counter === 0){
              db.collection("users").doc(user.data().name).update({league : "Champion", notifications:[...user.data().notifications,{
                                                                                                        type: "leagueChange",
                                                                                                        sentAt: firebase.firestore.Timestamp.now(),
                                                                                                        league: "Champion",
                                                                                                        message: "Yayy!! You are a Champion now" 
                                                                                                      }]
              })
              counter++;}
              else if(counter>0 && counter < 100){
                db.collection("users").doc(user.data().name).update({league : "Legendary", notifications:[...user.data().notifications,{
                                                                                                          type: "leagueChange",
                                                                                                          sentAt: firebase.firestore.Timestamp.now(),
                                                                                                          league: "Legendary",
                                                                                                          message: (user.data().league === "Champion") ? "Oh no ! You have been demoted" : "Yay! You have been promoted" 
                                                                                                        }]
                })
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