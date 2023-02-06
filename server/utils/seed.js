const connection = require('../config/connection');
const { Task, User, Reward } = require('../models');
const { getRandomUser, getRandomArrItem } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  await Task.deleteMany({});
  await User.deleteMany({});
  await Reward.deleteMany({});

  const users = [];
  const tasks = [];
  const rewards = [];

  const userByUserName = {};
  const friendsByUserName = {};

  for (let i = 0; i < 5; i++) {
    const {username, email} = getRandomUser();

    users.push({
      username,
      email,
      tasks: [],
      friends: [],
      rewards: [],
      xp: 0,
      coins: 0,
      level: 0
    });

    userByUserName[username] = users[i];
    friendsByUserName[username] = [];
  }

  
  friendsByUserName[users[0].username].push(users[1].username);
  friendsByUserName[users[1].username].push(users[0].username);

  for (let i = 0; i < 5; i++) {
    const username = getRandomArrItem(users).username;
    const user = users.find((user) => user.username === username);

    const friendCount = Math.floor(Math.random() * 3) + 1;
    for(let j = 0; j < friendCount; j++) {
      let friend = getRandomArrItem(users);
      if(friend.username !== user.username && !friendsByUserName[user.username].includes(friend.username)) {
        friendsByUserName[user.username].push(friend.username);
        friendsByUserName[friend.username].push(user.username);
      }
    }
  }



  for (let i = 0; i < 25; i++) {
    const title = `test ${i}`;
    const description = `test ${i} description`;
    const username = getRandomArrItem(users).username;

    const rewardTitle = `reward ${i}`;
    const rewardDescription = `reward ${i} description`;
    const rewardCost = Math.floor(Math.random() * 100) + 1;

    rewards.push({
      title: rewardTitle,
      description: rewardDescription,
      cost: rewardCost,
      creator: username,
      createdAt: new Date()
    });

    tasks.push({
      title,
      description,
      createdAt: new Date(),
      creator: username,
      completedOn: null,
      xp: Math.floor(Math.random() * 100) + 1,
      coins: Math.floor(Math.random() * 100) + 1
    });

    const user = users.find((user) => user.username === username);
    user.tasks.push(tasks[i]);
    user.rewards.push(rewards[i]);
  }

  await User.collection.insertMany(users);
  await Task.collection.insertMany(tasks);
  await Reward.collection.insertMany(rewards);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const friends = friendsByUserName[user.username];
    for(let j = 0; j < friends.length; j++) {
      const friend = userByUserName[friends[j]];
      user.friends.push(friend._id);
    }

    await User.findByIdAndUpdate(user._id, {friends: user.friends});
  }

  console.table(users);
  console.info('Seeding complete! 🌱');

  process.exit(0);
});
