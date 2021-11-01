import bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import { registerValidate, loginValidate } from './Validators';
import { issueTokens, getAuthUser, getRefreshTokenUser } from '../Auth/auth';
import Users from '../../Models/Model';
import Events from '../../Models/EventModel';
import Post from "../../Models/PostModel";

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
    getPosts: async (parent, args, context) => {
      const posts = await Post.find().sort({ createdAt: -1 });
      return posts;
    },
    getPost: async (_, { postId }) => {
      const post = await Post.findById(postId);
      if (post) {
        return post;
      } else {
        throw new Error('Post not found');
      }
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
      const authUser = await getAuthUser(context.req, true);
      const Event = { ...args };
      const newEvent = await Events.create(Event);
      console.log(newEvent);
      return {
        newEvent,
      };
    },
    createPost: async (_, { body }, context) => {
      const authUser = await getAuthUser(context.req, true);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
  },
};
export default resolvers;
