/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
// @ts-check
const assert = require('assert');
const {User, Task, Reward} = require('../models');

const {signToken} = require('../utils/auth');

const range = (min, max) => ({min, max});

const removeUndefinedValues = (obj) => {
    const clean = JSON.parse(JSON.stringify(obj)); // This removes undefined values
    Object.keys(clean).forEach((key) => { // Next, remove any empty objects
        if(typeof clean[key] === 'object' && Object.keys(clean[key]).length === 0) {
            delete clean[key];
        }
    });
    return clean;
};

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        user: async(_p, args, _contextValue) => {
            const {username, email} = args;
            const argsClean = removeUndefinedValues({username, email});
            const user = await User.findOne(argsClean)
                .populate('tasks')
                .populate('rewards')
                .exec();
            return user;
        },
        users: async(_p, args, _contextValue) => {
            const {
                username,
                email,
                xp = range(0, 1_000_000_000_000),
                coins = range(0, 1_000_000_000_000),
                level = range(1, 1_000),
            } = args;
            const _xp = {$gte: xp.min, $lte: xp.max};
            const _coins = {$gte: coins.min, $lte: coins.max};
            const _level = {$gte: level.min, $lte: level.max};

            const argsClean = removeUndefinedValues({username, email, xp: _xp, level: _level, coins: _coins});
            const users = await User.find(argsClean)
                .populate('tasks')
                .populate('rewards')
                .exec();
            return users;
        },
        me: async(_p, _args, {user}) => {
            if(!user) { throw new Error('Not logged in'); }
            return User.findById(user._id)
                .populate('tasks')
                .populate('rewards')
                .exec();
        },
        tasks: async(_p, args, _contextValue) => {
            const {creator, title, completed, coins = range(0, 1_000_000_000_000)} = args;
            const _coins = {$gte: coins.min, $lte: coins.max};
            const completedOn = completed ? {$ne: null} : undefined;
            const argsClean = removeUndefinedValues({creator, title, coins: _coins, completedOn});
            return Task.find(argsClean).exec();
        },
        rewards: async(_p, args, _contextValue) => {
            const {creator, cost: {max, min} = {max: undefined, min: undefined}, title} = args;
            const cost = {$gte: min, $lte: max};
            const argsClean = removeUndefinedValues({creator, cost, title});
            return Reward.find(argsClean).exec();
        },
    },
    Mutation: {
        addUser: async(_p, args) => {
            const {username, email, password} = args;
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return {user, token};
        },
        login: async(_p, args) => {
            const {username, email, password} = args;

            const user = await User.findOne({$or: [{username}, {email}]}).exec();
            if(!user) throw new Error('Invalid username, email or password');

            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) throw new Error('Invalid username, email or password');

            const token = signToken(user);

            return {user, token};
        },
        updateUser: async(_p, {username, email, password}, {user}) => {
            if(!user) { throw new Error('Not logged in'); }
            const cleanArgs = removeUndefinedValues({email, username, password});
            return User.findByIdAndUpdate(user._id, cleanArgs, {new: true}).exec();
        },
        addTask: async(_p, {title, description, coins, xp}, {user}) => {
            if(!user) { throw new Error('Not logged in'); }

            return Task.create({title, description, creator: user.username, coins, xp});
        },
        addReward: async(_p, {title, description, cost}, {user}) => {
            if(!user) { throw new Error('Not logged in'); }

            return Reward.create({title, description, creator: user.username, cost});
        },
        completeTask: async(_p, {id}, {user}) => {
            if(!user) { throw new Error('Not logged in'); }

            const task = await Task.findById(id).exec();

            if(!task) throw new Error('Task not found');
            if(task.creator !== user.username) throw new Error('Not authorized to complete this task');
            if(task.completedOn) throw new Error('Task already completed');

            await task.update({completedOn: new Date()}).exec();

            await User
                .findByIdAndUpdate(user._id, {$inc: {xp: task.xp, coins: task.coins}}, {runValidators: true})
                .exec();

            return task;
        },
        purchaseReward: async(_p, args, {user}) => {
            if(!user) { throw new Error('Not logged in'); }

            const {id} = args;
            const reward = await Reward.findById(id).exec();
            if(!reward) throw new Error('Reward not found');
            if(reward.creator !== user.username) throw new Error('Not authorized to purchase this reward');

            await reward.update({$inc: {redeemCount: 1}}).exec();

            const userDoc = await User.findById(user._id).exec();
            assert(userDoc, 'SHOULD NOT HAPPEN: User not found');
            const userCoins = userDoc.coins;
            if(userCoins < reward.cost) throw new Error('Not enough coins to purchase this reward');
            await userDoc.update({$inc: {coins: -reward.cost}}).exec();

            return reward;
        },
    },
};

module.exports = {resolvers};
