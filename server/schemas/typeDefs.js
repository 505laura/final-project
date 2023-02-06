const {gql} = require('apollo-server-express');

const typeDefs = gql`
  scalar Date # This is a custom scalar type we use to represent dates

  type User {
    id: ID,
    username: String,
    email: String,
    password: String,
    xp: Int,
    coins: Int,
    level: Int,
    tasks: [Task],
    rewards: [Reward]
  }

  input Range {
    min: Int,
    max: Int
  }

  type Task {
    id: ID,
    title: String,
    description: String,
    createdAt: Date,
    creator: String,
    completedOn: Date,
    coins: Int!,
    daily: Boolean,
    negative: Boolean,
    xp: Int!
  }

  type Reward {
    id: ID,
    title: String,
    description: String,
    cost: Int,
    creator: String,
    createdAt: Date
  }

  type Auth {
    token: ID!,
    user: User
  }

  type Query {
    users(username: String, email: String, xp: Range, coins: Range, level: Range): [User],
    user(username: String, email: String, id: ID): User,
    me: User,

    tasks(title: String, creator: String, completed: Boolean, coins: Range, xp: Range): [Task],
    task(title: String, creator: String, id: ID): Task,
  
    rewards(title: String, creator: String, cost: Range): [Reward]
    reward(title: String, creator: String, id: ID): Reward
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth,
    updateUser(username: String, email: String, password: String): User,
    addTask(title: String!, description: String!, coins: Int!, xp: Int!, daily: Boolean, negative: Boolean): Task,
    deleteTask(id: String!): Task,
    addReward(title: String!, description: String!, cost: Int!): Reward,
    deleteReward(id: String!): Reward,
    completeTask(id: String!): Task,
    purchaseReward(id: String!): Reward
    login(username: String, email: String, password: String!): Auth
  }
`;

module.exports = {typeDefs};
