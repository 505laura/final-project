import React, {useEffect} from 'react';
import Habits from '../components/Habits';
import Stats from '../components/Stats';

import {UserContext} from '../utils/userContext';

import ProgressBar from '@ramonak/react-progress-bar';

import Auth from '../utils/auth';

import {useLazyQuery, useQuery} from '@apollo/client';
import {QUERY_TASKS, QUERY_REWARDS, QUERY_ME} from '../utils/queries';
import {useContext} from 'react';

const xpForEachLevel = [0, 4, 13, 32, 65, 112, 178, 276, 393, 540, 745, 967, 1_230, 1_591, 1_957, 2_457, 3_046, 3_732, 4_526, 5_440, 6_482, 7_666, 9_003, 10_506, 12_187, 14_060, 16_140, 18_439, 20_974, 23_760, 26_811, 30_146, 33_780, 37_731, 42_017, 46_656, 50_653, 55_969, 60_505, 66_560, 71_677, 78_533, 84_277, 91_998, 98_415, 107_069, 114_205, 123_863, 131_766, 142_500, 151_222, 163_105, 172_697, 185_807, 196_322, 210_739, 222_231, 238_036, 250_562, 267_840, 281_456, 300_293, 315_059, 335_544, 351_520, 373_744, 390_991, 415_050, 433_631, 459_620, 479_600, 507_617, 529_063, 559_209, 582_187, 614_566, 639_146, 673_863, 700_115, 737_280, 765_275, 804_997, 834_809, 877_201, 908_905, 954_084, 987_754, 1_035_837, 1_071_552, 1_122_660, 1_160_499, 1_214_753, 1_254_796, 1_312_322, 1_354_652, 1_415_577, 1_460_276, 1_524_731, 1_571_884, 1_640_000]

// Create a function to return the users level based on their xp, using the formula pokemon uses
const getLevel = (xp) => {
  let level = 0;
  for (let i = 0; i < xpForEachLevel.length; i++) {
    if (xp >= xpForEachLevel[i]) {
      level = i;
    }
  }
  return level;
};

const Dashboard = (props) => {

  const [progress, setProgress] = React.useState(0);
  const [nextLevelXP, setNextLevelXP] = React.useState(4);

  const username = Auth.loggedIn() ? Auth.getProfile().data.username : null;
  const [getTasks, {data: taskData}] = useLazyQuery(QUERY_TASKS);
  const [getRewards, {data: rewardData}] = useLazyQuery(QUERY_REWARDS);
  const {data: userData} = useQuery(QUERY_ME);

  const {xp, coins, level, setCoins, setXP, setLevel} = useContext(UserContext);

  useEffect(() => {
    console.log('user', {xp, coins, level});
    // get the user's tasks
    if(!taskData) {
      console.log('Getting tasks from API');
      getTasks({variables: {creator: username}});
    }
    if(!rewardData) {
      console.log('Getting rewards from API');
      getRewards({variables: {creator: username}});
    }

    setXP(xp || userData?.me?.xp);
    setLevel(getLevel(xp));
    setCoins(coins || userData?.me?.coins);
    setProgress(xp - xpForEachLevel[getLevel(xp)]);
    setNextLevelXP(xpForEachLevel[getLevel(xp) + 1]);
  }, [getTasks, taskData, username, getRewards, rewardData, userData, coins, level, xp, setCoins, setXP, setLevel, setProgress, setNextLevelXP]);

  return (
    <div className="container">
      <div style={{display: 'flex'}}>
        Coins: {coins}
        Level: {level}
        <ProgressBar width={'80vw'} completed={`${progress}`} maxCompleted={nextLevelXP} /> {progress}/{nextLevelXP}
      </div>
      <Habits
        taskData={taskData?.tasks}
        rewardData={rewardData?.rewards}
        username={username}
        userData={userData?.me}
      />
      <Stats />
    </div>
  );
};

export default Dashboard;
