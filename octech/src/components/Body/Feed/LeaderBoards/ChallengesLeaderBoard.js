import React, { useState, useEffect } from 'react';
import {db} from '../../../../firebase';
import firebase from 'firebase';
import LeaderBoardComponent from './LeaderBoardComponent';

function ChallengesLeaderBoard({ match, setValue }) {
    return (
        <LeaderBoardComponent title="Challenges LeaderBoard" headers={['Name', 'Points']} columns={[]} data={[]}/>
    )
};

export default ChallengesLeaderBoard;