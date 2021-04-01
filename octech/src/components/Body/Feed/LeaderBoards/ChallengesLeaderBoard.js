import React, { useState } from 'react';
import { db } from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/userSlice';

function ChallengesLeaderBoard() {

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const user = useSelector(selectUser);

  if (dataFetched === false) {
    //Fetching the data for the challenges from firebase
    db.collection('challenges')
      .onSnapshot(async data => {
        let challenges = data.docs.map(chal => {
          return chal.data();
        });

        let tempLeaderboardData = [];
        challenges.forEach(async chal => {
          await new Promise(resolve => {
            db.collection('challengePosts')
            .where('challenge', '==', chal.name)
            .orderBy('totalStars', 'desc')
            .onSnapshot(async chalPosts => {
              let rank = 1
              tempLeaderboardData.push({
                challengeName: chal.name,
                challengeDesc: chal.description,
                postData: chalPosts.docs.map(post => {
                  let postt = {...post.data(), rank : rank++}
                  return postt;
                })
              });
              resolve();
            })
          });
        });

        
        setDataFetched(true);
        setLeaderBoardData(tempLeaderboardData);
      })
  }

  return (
    //Assigning the columns of data to diplay
    leaderboardData.map((data, i) => {
      if (data.postData.length !== 0)
        return <LeaderBoardComponent key={i} title={data.challengeName + " LeaderBoard"} headers={['Post Caption', 'Submitted By', 'Total Stars']} columns={['caption', 'creator', 'totalStars']} limit={100} data={data.postData} highlightColumn={'creator'} highlightColumnData={user.displayName} />
      else 
        return <></>
    })
    
  )
}

export default ChallengesLeaderBoard;