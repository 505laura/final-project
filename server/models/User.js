/* eslint-disable func-names */
const {Schema, model} = require('mongoose');

const isEmail = require('validator/lib/isEmail');
const owasp = require('owasp-password-strength-test');
const bcrypt = require('bcrypt');
const {taskSchema} = require('./Task');
const {rewardSchema} = require('./Reward');

const saltRounds = 10;

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [isEmail, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: (val) => {
                    const result = owasp.test(val);
                    if(!result.strong) {
                        throw new Error(result.errors.join('|'));
                    }
                    return true;
                },
            },
        },
        xp: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 1_000_000_000_000,
        },
        coins: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 1_000_000_000_000,
        },
        level: { // May be virtual if we can use xp to calculate level
            type: Number,
            required: true,
            default: 1,
            min: 1,
            max: 1_000,
        },
        tasks: {type: [taskSchema]},
        rewards: [rewardSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    },
);

userSchema.pre('save', async function(next) {
    if(this.$isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = {User, userSchema};
