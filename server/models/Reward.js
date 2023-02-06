const {Schema, model} = require('mongoose');

const {dateFormatter} = require('../utils');

const rewardSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: dateFormatter,
        },
        redeemCount: {
            type: Number,
            default: 0,
        },
        creator: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        cost: {
            type: Number,
            required: true,
            min: 1,
            max: 1_000_000_000_000,
        },
    },
);

const Reward = model('reward', rewardSchema);

module.exports = {Reward, rewardSchema};
