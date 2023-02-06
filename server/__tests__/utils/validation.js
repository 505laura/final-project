const {z} = require('zod');

const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    createdAt: z.string(),
    creator: z.string(),
    completedOn: z.union([z.string(), z.null()]),
    coins: z.number(),
    xp: z.number(),
}).strict();

const rewardSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    cost: z.number(),
    creator: z.string(),
    createdAt: z.string(),
}).strict();

const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    xp: z.number(),
    coins: z.number(),
    level: z.number(),
    tasks: z.array(taskSchema),
    rewards: z.array(rewardSchema),
}).strict();

const newUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
}).strict();

const getAllUsersReturnSchema = (length) => {
    let users = z.array(userSchema);
    if(length) {
        users = users.length(length);
    }
    return z.object({users});
};

const authSchema = (user) => z.object({user, token: z.string()});
const addUserReturnSchema = z.object({addUser: authSchema(newUserSchema)});
const addTaskReturnSchema = z.object({addTask: taskSchema});

const getAllTasksReturnSchema = (length) => {
    let tasks = z.array(taskSchema);
    if(length) {
        tasks = tasks.length(length);
    }
    return z.object({tasks});
};

const completeTaskReturnSchema = z.object({completeTask: taskSchema});
const updateUserReturnSchema = z.object({updateUser: newUserSchema});
const loginReturnSchema = z.object({login: authSchema(newUserSchema)});
const addRewardReturnSchema = z.object({addReward: rewardSchema});

const getAllRewardsReturnSchema = (length) => {
    let rewards = z.array(rewardSchema);
    if(length) {
        rewards = rewards.length(length);
    }
    return z.object({rewards});
};

const purchaseRewardReturnSchema = z.object({purchaseReward: rewardSchema});

module.exports = {
    schemas: {
        task: taskSchema,
        reward: rewardSchema,
        user: userSchema,
        addUserReturn: addUserReturnSchema,
        getAllUsersReturn: getAllUsersReturnSchema,
        addTaskReturn: addTaskReturnSchema,
        getAllTasksReturn: getAllTasksReturnSchema,
        completeTaskReturn: completeTaskReturnSchema,
        updateUserReturn: updateUserReturnSchema,
        loginReturn: loginReturnSchema,
        addRewardReturn: addRewardReturnSchema,
        getAllRewardsReturn: getAllRewardsReturnSchema,
        purchaseRewardReturn: purchaseRewardReturnSchema,
    },
};
