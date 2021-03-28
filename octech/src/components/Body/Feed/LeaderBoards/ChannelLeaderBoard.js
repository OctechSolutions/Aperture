import React, { useState } from 'react';
import {db} from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';
import { selectUser } from "../../../../features/userSlice";
import { useSelector } from "react-redux";


function ChannelLeaderBoard({ match, setValue }) {

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const user = useSelector(selectUser);

    if (dataFetched===false) {

      db.collection('globalLeaderBoards').doc('channelLeaderBoard').onSnapshot(data => {
          setDataFetched(true);
          if(data.data())
            var channels = data.data().channels;
            setLeaderBoardData(channels);
    })} 

  return (

    <LeaderBoardComponent title="Fastest Growing Channels" headers={['Channel Name','Creator',"New Followers"]} columns={['name', 'creator','newFollowers']} data={leaderboardData} />
    
  )
}

export default ChannelLeaderBoard;