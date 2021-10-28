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
     }
`;
module.exports = { typeDefs };
