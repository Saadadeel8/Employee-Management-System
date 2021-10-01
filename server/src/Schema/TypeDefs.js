import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type User {
        id: ID
        name: String
        email: String
        username: String
        createdAt: String
        updatedAt: String
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
        }
    
     # Mutations
     type Mutation {
         register(
             name: String!
             email: String!
             username: String!
             password: String!
         ): Auth!
         login(
             username: String!
             password: String!): Auth
     }
`;
module.exports = { typeDefs };
