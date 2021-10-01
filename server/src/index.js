import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import consola from 'consola';
import { DB, APP_PORT } from '../config';
import resolvers from './Schema/Resolvers';

const { typeDefs } = require('./Schema/TypeDefs');

//  Initialize the App
const app = express();

//  Start Application Function
const startApp = async () => {
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
      context: ({ req }) => ({
        req,
      }),
    });
    await server.start();
    //  Setting up Middlewares
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
