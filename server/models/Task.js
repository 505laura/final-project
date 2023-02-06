const {Schema, model} = require('mongoose');

const {dateFormatter} = require('../utils');

const taskSchema = new Schema(
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
        deadline: {
            type: Date,
            default: null,
            get: dateFormatter,
        },
        daily: {
            type: Boolean,
            default: false,
        },
        negative: {
            type: Boolean,
            default: false,
        },
        completedOn: {
            type: Date,
            default: null,
            get: dateFormatter,
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
        coins: {
            type: Number,
            required: true,
            min: 1,
            max: 1_000_000_000_000,
        },
        xp: {
            type: Number,
            required: true,
            min: 1,
            max: 1_000_000_000_000,
        },
    },
);

const Task = model('task', taskSchema);

module.exports = {Task, taskSchema};
