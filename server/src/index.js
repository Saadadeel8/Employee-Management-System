import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import consola from 'consola';
import { PubSub } from 'graphql-subscriptions';
import { DB, APP_PORT, APP_SECRET } from '../config';
import resolvers from './Schema/Resolvers';

const jwt = require('jsonwebtoken');

const pubsub = new PubSub();

const {
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');

const { typeDefs } = require('./Schema/TypeDefs');

//  Initialize the App
const app = express();

//  Start Application Function
const startApp = async () => {
  // get the user info from a JWT
  const getUser = (token) => {
    if (token) {
      try {
        // return the user information from the token
        return jwt.verify(token, APP_SECRET);
      } catch (err) {
        // if there's a problem with the token, throw an error
        return console.log('Session invalid');
      }
    }
  };
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  try {
    //  Starting the Apollo-Express-Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cors: corsOptions,
      context: ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization;
        // try to retrieve a user with the token
        const user = getUser(token);
        // for now, let's log the user to the console:
        console.log(user);
        // add the db models and the user to the context
        return { req, pubsub };
      },
    });
    await server.start();
    //  Setting up Middlewares
    app.use(graphqlUploadExpress());
    server.applyMiddleware({ app });
    app.get('/', () => {
      console.log('Apollo GraphQL Express server is ready');
    });

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    consola.success({
      message: 'Successfully Connected with the Database',
      badge: true,
    });

    app.listen({ port: APP_PORT }, () => {
      consola.success({
        message: `Apollo Server started on http://localhost:5000${server.graphqlPath}`,
        badge: true,
      });
    });
  } catch (err) {
    consola.error({
      message: `Unable to start the server ${err.message}`,
      badge: true,
    });
  }
};
startApp();
