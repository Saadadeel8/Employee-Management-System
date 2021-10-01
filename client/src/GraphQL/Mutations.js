import { gql } from '@apollo/client';

export const CREATE_NEW_USER = gql`
    mutation register($name: String! $email: String! $username: String! $password: String!) {
        register(name: $name email: $email username: $username password: $password) {
            user{
                name
                email
                username
            }
            token
            refreshToken
        }
    },
`;
export const LOGIN_USER = gql`
    mutation login($username: String! $password: String!) {
        login(username: $username password: $password) {
            user{
                name
                email
                username
            }
            token
            refreshToken
        }
    },
`;
