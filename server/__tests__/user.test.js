// @ts-check

process.env.PORT = '3002';

const {GraphQLClient, gql} = require('graphql-request');
const {getRandomUser} = require('../utils/data');

const {schemas} = require('./utils/validation');
const {startServer, stopServer} = require('../server');

const gqlClient = new GraphQLClient(`http://localhost:${process.env.PORT}/graphql`);

const taskObject = 'id, title, description, createdAt, creator, completedOn, coins, xp';
const rewardObject = 'id, title, description, cost, creator, createdAt';

const expectSchemaToBeValid = (schema, data) => {
    const res = schema.safeParse(data);
    expect(res.error).toBe(undefined);
    expect(res.success).toBe(true);
    return res.data;
};

const getAllUsersQuery = (filter) => gql`{
    users${filter ?? ''} {
        id, username, email, xp, coins, level, tasks {${taskObject}},
        rewards {${rewardObject}}
    }
}`;

const addUserQuery = (user) => gql`mutation {
    addUser(username: "${user.username}", email: "${user.email}", password: "${user.password}") {
        user {
            username, email, id
        }
        token
    }
}`;

const addTaskF = async(client, {title, description, coins, xp} = {title: 'Task Title', description: 'Task Description', coins: 10, xp: 10}) => {
    const res = await client.request(gql`mutation {
        addTask(title: "${title}", description: "${description}", coins: ${coins}, xp: ${xp}) {
            title, description, createdAt, creator, completedOn, coins, xp, id
        }
    }`);

    return res.addTask;
};

const completeTaskF = async(client, id) => {
    const res = await client.request(gql`mutation {
        completeTask(id: "${id}") {
            title, description, createdAt, creator, completedOn, coins, xp, id
        }
    }`);

    return res.completeTask;
};

const addNewUser = async() => {
    const user = getRandomUser();
    const res = await gqlClient.request(addUserQuery(user));
    const client = new GraphQLClient(`http://localhost:${process.env.PORT}/graphql`, {headers: {authorization: `Bearer ${res.addUser.token}`}});
    const task = await addTaskF(client);
    return {user: {...user, id: res.addUser.user.id}, client, task};
};

const meQuery = gql`{
    me {
        id, username, email, xp, coins, level, tasks {${taskObject}}, rewards {${rewardObject}}
    }
}`;

const baseUser = {tasks: [], rewards: [], xp: 0, coins: 0, level: 1};

const getFirstErrMsg = (error) => error.response.errors[0].message;

describe('API tests', () => {
    beforeAll(async() => {
        await startServer(true);
    });

    afterAll(async() => {
        stopServer();
    });

    describe('User', () => {
        describe('Create a user', () => {
            it('Creates a user', async() => {
                const user = getRandomUser();
                const res = await gqlClient.request(addUserQuery(user));

                expectSchemaToBeValid(schemas.addUserReturn, res);
            });
        });

        describe('Get users', () => {
            it('Returns all users', async() => {
                const users = await gqlClient.request(getAllUsersQuery());
                expectSchemaToBeValid(schemas.getAllUsersReturn(), users);
            });

            it('Filters users', async() => {
                const {user} = await addNewUser();

                const users = await gqlClient.request(getAllUsersQuery(`(username: "${user.username}")`));
                expectSchemaToBeValid(schemas.getAllUsersReturn(1), users);
            });

            it('Uses the me query', async() => {
                const {user, client} = await addNewUser();

                const res = await client.request(meQuery);
                const data = expectSchemaToBeValid(schemas.user, res.me);

                delete user.password;
                expect(data).toStrictEqual({...baseUser, ...user});
            });

            it('Fails to use the me query', async() => {
                const res = await gqlClient.request(meQuery).catch(getFirstErrMsg);

                expect(res).toBe('Not logged in');
            });

            it('Fails if no user is found', async() => {
                const res = await gqlClient.request(gql`{
                user(username: "not_a_user") {
                    username, email
                }
            }`);

                expect(res.user).toBeNull();
            });
        });

        describe('Update a user', () => {
            it('Updates a users username', async() => {
                const {user, client} = await addNewUser();

                const res = await client.request(gql`mutation {
                updateUser(username: "${user.username}A") {
                    username, email, id
                }
            }`);

                const data = expectSchemaToBeValid(schemas.updateUserReturn, res);

                expect(data).toStrictEqual({
                    updateUser: {
                        username: `${user.username}A`,
                        email: user.email,
                        id: user.id,
                    },
                });
            });

            it('Fails to update a user', async() => {
                const {user} = await addNewUser();

                const res = await gqlClient.request(gql`mutation {
                updateUser(username: "${user.username}A") { id }
            }`).catch(getFirstErrMsg);

                expect(res).toBe('Not logged in');
            });

            it('Updates a users email', async() => {
                const {user, client} = await addNewUser();

                const res = await client.request(gql`mutation {
                updateUser(email: "a${user.email}") {
                    username, email, id
                }
            }`);
                // console.log(res);

                const data = expectSchemaToBeValid(schemas.updateUserReturn, res);
                expect(data).toStrictEqual({
                    updateUser: {
                        username: user.username,
                        email: `a${user.email}`,
                        id: user.id,
                    },
                });
            });

            it('Updates a users password', async() => {
                const {user, client} = await addNewUser();

                const res = await client.request(gql`mutation {
                updateUser(password: "${user.password}A") {
                    username, email, id
                }
            }`);

                // Can't check password since it's not returned to us
                expectSchemaToBeValid(schemas.updateUserReturn, res);
            });
        });

        describe('Auth', () => {
            it('Logs in a user', async() => {
                const {user} = await addNewUser();

                const res = await gqlClient.request(gql`mutation {
                login(username: "${user.username}", password: "${user.password}") {
                    user {
                        username, email, id
                    }
                    token
                }
            }`);

                expectSchemaToBeValid(schemas.loginReturn, res);
            });

            it('Fails if the JWT is invalid', async() => {
                const res = await gqlClient.request(meQuery, {}, {authorization: 'Bearer NOTAVALIDTOKEN'}).catch(getFirstErrMsg);
                expect(res).toBe('Not logged in');
            });

            it('Fails to log in a user', async() => {
                const {user} = await addNewUser();

                const res = await gqlClient.request(gql`mutation {
                    login(username: "${user.username}", password: "${user.password}A") { token }
                }`).catch(getFirstErrMsg);

                expect(res).toBe('Invalid username, email or password');
            });

            it('Fails to log in when no user is found', async() => {
                const {user} = await addNewUser();

                const res = await gqlClient.request(gql`mutation {
                    login(username: "${user.username}A", password: "${user.password}") { token}
                }`).catch(getFirstErrMsg);

                expect(res).toBe('Invalid username, email or password');
            });

            it('Fails if the password is weak', async() => {
                const weakUser = {username: 'test_username_weak', email: 'weak_password@google.com', password: 'weakpassword'};
                const res = await gqlClient.request(addUserQuery(weakUser))
                    .catch(getFirstErrMsg);

                expect(res).toBe('user validation failed: password: The password must contain at least one uppercase letter.|The password must contain at least one number.|The password must contain at least one special character.');
            });
        });
    });

    describe('Task', () => {
        describe('Create a task', () => {
            it('Creates a task', async() => {
                const {client} = await addNewUser();

                const res = await client.request(gql`mutation {
                addTask(title: "Test Task", description: "This is a test task", coins: 10, xp: 10) {
                    title, description, createdAt, creator, completedOn, coins, xp, id
                }
            }`);

                expectSchemaToBeValid(schemas.addTaskReturn, res);
            });

            it('Fails to create a task when not logged in', async() => {
                const res = await gqlClient.request(gql`mutation {
                    addTask(title: "Test Task", description: "This is a test task", coins: 10, xp: 10) {
                        title, description, createdAt, creator, completedOn, coins, xp, id
                    }
                }`).catch(getFirstErrMsg);

                expect(res).toBe('Not logged in');
            });
        });

        it('Gets all tasks', async() => {
            const {client} = await addNewUser();

            const res = await client.request(gql`{
                tasks {
                    ${taskObject}
                }
            }`);

            expectSchemaToBeValid(schemas.getAllTasksReturn(), res);
        });

        it('Gets all tasks for a user', async() => {
            const {user, client} = await addNewUser();

            const res = await client.request(gql`{
                tasks(creator: "${user.username}") {
                    ${taskObject}
                }
            }`);

            expectSchemaToBeValid(schemas.getAllTasksReturn(1), res);
        });

        describe('Task Completion', () => {
            it('Completes a task', async() => {
                const {client, task} = await addNewUser();

                const userBefore = await client.request(meQuery);

                const res = await client.request(gql`mutation {
                    completeTask(id: "${task.id}") {
                        title, description, createdAt, creator, completedOn, coins, xp, id
                    }
                }`);

                const userAfter = await client.request(meQuery);

                const {completeTask} = expectSchemaToBeValid(schemas.completeTaskReturn, res);
                expect(userAfter.me.xp).toBe(userBefore.me.xp + completeTask.xp);
                expect(userAfter.me.coins).toBe(userBefore.me.coins + completeTask.coins);
            });

            it('Fails to complete a task if the user is not logged in', async() => {
                const {task} = await addNewUser();

                const res = await gqlClient.request(gql`mutation {
                    completeTask(id: "${task.id}") {
                        title, description, createdAt, creator, completedOn, coins, xp, id
                    }
                }`).catch(getFirstErrMsg);

                expect(res).toBe('Not logged in');
            });

            it('Fails to complete a task that doesn\'t exist', async() => {
                const {client, task} = await addNewUser();

                const res = await completeTaskF(client, `${task.id.slice(0, -3)}123`).catch(getFirstErrMsg);

                expect(res).toBe('Task not found');
            });

            it('Fails to complete a task that has already been completed', async() => {
                const {client, task} = await addNewUser();

                await completeTaskF(client, task.id);

                const res = await completeTaskF(client, task.id).catch(getFirstErrMsg);

                expect(res).toBe('Task already completed');
            });

            it('Fails to complete a task that doesn\'t belong to the user', async() => {
                const {task} = await addNewUser();

                const {client: client2} = await addNewUser();

                const res = await completeTaskF(client2, task.id).catch(getFirstErrMsg);

                expect(res).toBe('Not authorized to complete this task');
            });
        });

        it('Gets all completed tasks for a user', async() => {
            const {user} = await addNewUser();

            const res = await gqlClient.request(gql`{
                tasks(creator: "${user.username}", completed: true) {
                    ${taskObject}
                }
            }`);

            expectSchemaToBeValid(schemas.getAllTasksReturn(), res);
        });
    });

    describe('Reward', () => {
        describe('Create a reward', () => {
            it('Creates a reward', async() => {
                const {client} = await addNewUser();

                const res = await client.request(gql`mutation {
                    addReward(title: "Test Reward", description: "This is a test reward", cost: 10) {
                        title, description, createdAt, creator, cost, id
                    }
                }`);

                expectSchemaToBeValid(schemas.addRewardReturn, res);
            });

            it('Fails to create a reward when not logged in', async() => {
                const res = await gqlClient.request(gql`mutation {
                    addReward(title: "Test Reward", description: "This is a test reward", cost: 10) { id }
                }`).catch(getFirstErrMsg);

                expect(res).toBe('Not logged in');
            });
        });

        describe('Purchase a reward', () => {
            it('Purchases a reward', async() => {
                const {client, task} = await addNewUser();

                await client.request(gql`mutation {
                    completeTask(id: "${task.id}"){ title }
                }`);

                const userBefore = await client.request(meQuery);
                const {addReward} = await client.request(gql`mutation {
                    addReward(title: "Test Reward", description: "This is a test reward", cost: 5) {
                        cost, id
                    }
                }`);

                await client.request(gql`mutation {
                    purchaseReward(id: "${addReward.id}") { id }
                }`);

                const userAfter = await client.request(meQuery);

                expect(userAfter.me.coins).toBe(userBefore.me.coins - addReward.cost);
            });

            it('Fails to purchase a reward that does not exist', async() => {
                const {user, client} = await addNewUser();

                const res = await client.request(gql`mutation {
                purchaseReward(id: "${`${user.id.slice(0, -3)}123`}") { id }
            }`).catch(getFirstErrMsg);

                expect(res).toBe('Reward not found');
            });

            it('Fails to purchase a reward that the user does not have enough coins for', async() => {
                const {client} = await addNewUser();

                const {addReward} = await client.request(gql`mutation {
                    addReward(title: "Test Reward", description: "This is a test reward", cost: 5) {
                        cost, id
                    }
                }`);

                const res = await client.request(gql`mutation {
                    purchaseReward(id: "${addReward.id}") { id }
                }`).catch(getFirstErrMsg);

                expect(res).toBe('Not enough coins to purchase this reward');
            });

            it('Fails to purchase a reward that someone else made', async() => {
                const {client} = await addNewUser();

                const {addReward} = await client.request(gql`mutation {
                    addReward(title: "Test Reward", description: "This is a test reward", cost: 5) {
                        cost, id
                    }
                }`);

                const {client: client2} = await addNewUser();

                const res = await client2.request(gql`mutation {
                    purchaseReward(id: "${addReward.id}") { id }
                }`).catch(getFirstErrMsg);

                expect(res).toBe('Not authorized to purchase this reward');
            });

            it('Fails to purchase a reward when not logged in', async() => {
                const res = await gqlClient.request(gql`mutation {
                    purchaseReward(id: "123") { id }
                }`).catch(getFirstErrMsg);

                expect(res).toBe('Not logged in');
            });
        });

        it('Gets all rewards', async() => {
            const res = await gqlClient.request(gql`{
                rewards {
                    ${rewardObject}
                }
            }`);

            expectSchemaToBeValid(schemas.getAllRewardsReturn(), res);
        });
    });
});

// Over 600 lines - 21:10
// 495 lines - 21:20
// 520 lines - 21:25 (Added lots of extra checks)
// 481 lines - 21:30
// 468 lines - 21:50 (Added id to task and reward and user objects)
// 445 lines - 22:30
