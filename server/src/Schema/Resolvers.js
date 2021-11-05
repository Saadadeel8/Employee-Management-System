import bcrypt from 'bcryptjs';
import Joi from '@hapi/joi';
import { registerValidate, loginValidate } from './Validators';
import { issueTokens, getAuthUser, getRefreshTokenUser } from '../Auth/auth';
import Users from '../../Models/Model';
import Events from '../../Models/EventModel';
import Post from '../../Models/PostModel';

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
      await getAuthUser(context.req);
      const posts = await Post.find().sort({ createdAt: -1 });
      return posts;
    },
    getPost: async (_, { postId }) => {
      const post = await Post.findById(postId);
      if (post) {
        return post;
      }
      throw new Error('Post not found');
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
    // Post Resolver
    createPost: async (_, { body }, context) => {
      const authUser = await getAuthUser(context.req, true);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: authUser.name,
        username: authUser.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post,
      });

      return post;
    },
    createComment: async (_, { postId, body }, context) => {
      const authUser = await getAuthUser(context.req, true);
      if (body.trim() === '') {
        throw new Error('Comment can not be empty');
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          postId,
          user: authUser.name,
          username: authUser.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      }
    },
    likePost: async (_, { postId }, context) => {
      const authUser = await getAuthUser(context.req, true);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === authUser.username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== authUser.username);
        } else {
          // Not liked, like post
          post.likes.push({
            username: authUser.username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
};
export default resolvers;
