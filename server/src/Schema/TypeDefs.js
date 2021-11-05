import { gql } from 'apollo-server-express';

const typeDefs = gql`

    type User {
        id: ID
        name: String
        email: String
        username: String
        gender: String
        company: String
        team: String
        designation: String
        createdAt: String
        updatedAt: String
}
    type Event {
        color: String
        from: String
        to: String
        modifier: String
        title: String
        createdBy: String
    }
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        user: String
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
  }
      type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
      }
      type Like {
        id: ID!
        createdAt: String!
        username: String!
      }
    type Auth {
        user: User
        token: String
        refreshToken: String
}
     # Queries
     type Query {
         profile: User
         users: [User]
         refreshToken: Auth!
         getEvents: [Event]
         getComments: [Post]
         getLikes: [Post]
         getPosts: [Post]
         getPost(postId: ID!): Post
        }
     # Mutations
     type Mutation {
         register(
             name: String
             email: String
             username: String
             password: String
             gender: String
             company: String
             team: String
             designation: String
         ): Auth!
         login(
             username: String!
             password: String!): Auth
         createevent(
             color: String
             from: String
             to: String
             modifier: String
             title: String
             createdBy: String
             ): Event
         createPost(body: String!): Post!
         createComment(postId: String!, body: String!): Post!
         likePost(postId: ID!): Post!
     }
     type Subscription {
    newPost: Post!
  }
`;
module.exports = { typeDefs };
