// @ts-check
require('dotenv').config();

const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const db = require('./config/connection');
const {typeDefs, resolvers} = require('./schemas');
const path = require('path');

const {authMiddleware} = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

const gqlServer = new ApolloServer({typeDefs, resolvers, context: authMiddleware});
let server;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
// }

const startServer = async(quiet) => {
    await gqlServer.start();
    gqlServer.applyMiddleware({app});

    return new Promise((resolve, reject) => {
        db.once('open', () => {
            server = app.listen(PORT, () => {
                if(!quiet) {
                    console.log(`Level Up API running on port ${PORT}!`);
                    console.log(`Use GraphQL at http://localhost:${PORT}${gqlServer.graphqlPath}`);
                }
                resolve(true);
            });
        });
    });
};

const stopServer = async() => {
    await gqlServer.stop();
    server.close();
    db.close();
};

module.exports = {startServer, server: gqlServer, app, stopServer};
