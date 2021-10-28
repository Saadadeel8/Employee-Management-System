import bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import { registerValidate, loginValidate } from './Validators';
import { issueTokens, getAuthUser, getRefreshTokenUser } from '../Auth/auth';
import Users from '../../Models/Model';
import Events from '../../Models/EventModel';

const resolvers = {

  Query: {
    // Return List of Users
    users: async (parent, args, context) => {
      await getAuthUser(context.req);
      const allUsers = await Users.find();
      return allUsers;
    },
    // Return List of Events
    getEvents: async (parent, args, context) => {
      await getAuthUser(context.req);
      const allEvents = await Events.find();
      return allEvents;
    },
    // Protected Resolver
    profile: async (parent, args, context) => {
      const authUser = await getAuthUser(context.req, true);
      return authUser;
    },
    // Refresh Token Mechanism
    refreshToken: async (parent, args, context) => {
      const authUser = await getRefreshTokenUser(context.req, true);
      const tokens = await issueTokens(authUser);
      return {
        user: authUser,
        ...tokens,
      };
    },
  },
  Mutation: {
    register: async (parent, args) => {
      //  Validate the user data
      await Joi.assert(args, registerValidate, { abortEarly: false });
      // Check if user is already in DB
      let user = await Users.findOne({ username: args.username });
      if (user) {
        throw new Error('Username is already taken');
      }

      user = await Users.findOne({ email: args.email });
      if (user) {
        throw new Error('Email is already taken');
      }
      // Register User
      const User = { ...args };
      User.password = await bcrypt.hash(User.password, 10);
      const newUser = await Users.create(User);
      // Issue token and refresh token
      const tokens = await issueTokens(newUser);
      return {
        user: newUser,
        ...tokens,
      };
    },
    // Login Resolver
    login: async (parent, args) => {
      await Joi.assert(args, loginValidate, { abortEarly: false });
      // Validate User
      const user = await Users.findOne({ username: args.username });
      if (!user) {
        throw new Error('Username not found.');
      }
      // Compare Password
      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        throw new Error('Invalid Password');
      }
      // Issue token and refresh token
      const tokens = await issueTokens(user);
      return {
        user,
        ...tokens,
      };
    },
    // Event Resolver
    createevent: async (parent, args, context) => {
      const authUser = await getAuthUser(context.req, true)
      const Event = { ...args };
      const newEvent = await Events.create(Event);
      console.log(newEvent)
      return{
        newEvent,
      }
    }
  },
};
export default resolvers;
