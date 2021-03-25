import React, { useState } from 'react';
import { db } from '../../../../firebase';
import LeaderBoardComponent from './LeaderBoardComponent';


function ChallengesLeaderBoard() {

  const [leaderboardData, setLeaderBoardData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

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
            .limit(100)
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
    leaderboardData.map((data, i) => {
      if (data.postData.length !== 0)
        return <LeaderBoardComponent key={i} title={data.challengeName + " LeaderBoard"} headers={['Post Caption', 'Submitted By', 'Total Stars']} columns={['caption', 'creator', 'totalStars']} data={data.postData} />;
    })
    
  )
}

export default ChallengesLeaderBoard;