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
              tempLeaderboardData.push({
                challengeName: chal.name,
                challengeDesc: chal.description,
                postData: chalPosts.docs.map(post => {
                  return post.data();
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
    leaderboardData.map((data, i) => {
      if (data.postData.length !== 0)
        return <LeaderBoardComponent key={i} title={data.challengeName + " LeaderBoard"} headers={['Post Caption', 'Submitted By', 'Total Stars']} columns={['caption', 'creator', 'totalStars']} limit={100} data={data.postData} highlightColumn={'creator'} highlightColumnData={user.displayName} />;
    })
    
  )
}

export default ChallengesLeaderBoard;