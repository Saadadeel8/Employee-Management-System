import { gql } from '@apollo/client';

export const VERIFY_USER = gql`
    query UserProfile{
        profile{
            name
            email
            username
            id
            company
            team
            gender
        }
    }`;
export const GENERATE_REFRESH_TOKEN = gql`
    query RefreshToken{
        users{
            name
            email
            username
        }
        refreshToken{
            token
            refreshToken
        }
    }`;

export const GET_ALL_USERS = gql`
    query UserList{
        users{
            name
            id
            email
            username
        }
    }`;
