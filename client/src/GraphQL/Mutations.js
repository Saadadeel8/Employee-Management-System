import { gql } from '@apollo/client';

export const CREATE_NEW_USER = gql`
    mutation register($name: String! $email: String! $username: String! $password: String! $team: String $gender: String $designation: String $company: String) {
        register(name: $name email: $email username: $username password: $password team: $team gender: $gender designation: $designation company: $company) {
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
