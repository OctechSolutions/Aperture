import React, { useState } from 'react';
import {db} from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';
import { selectUser } from "../../../../features/userSlice";
import { useSelector } from "react-redux";


function GlobalUsersLeaderBoard({ match, setValue }) {

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const user = useSelector(selectUser);

    if (dataFetched===false) {

      db.collection('globalLeaderBoards').doc('userLeaderBoard').get().then(data => {
          setDataFetched(true);
          if(data.data())
            var users = data.data().users;
            var topUsers = [];
            var gotMyRank = false;
            for(let i = 0; (i< 8 || !gotMyRank) && i<users.length; i++){
              if(users[i].data.name === user.displayName)
                gotMyRank=true;
              if(i<8)
                topUsers.push(users[i].data)
              else if(users[i].data.name === user.displayName)
                topUsers.push(users[i].data)
            }
            setLeaderBoardData(topUsers);
    })} 

  return (

    <LeaderBoardComponent title="Global Users LeaderBoard" headers={['Name','Profile Points']} columns={['name', 'profilePoints']} limit={8} data={leaderboardData} highlightColumn={'name'} highlightColumnData={user.name} />
    
  )
}

export default GlobalUsersLeaderBoard;