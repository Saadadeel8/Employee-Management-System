import { gql } from '@apollo/client';

export const VERIFY_USER = gql`
    query UserProfile{
        profile{
            name
            email
            username
            id
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
            team
            designation
        }
    }`;
export const GET_EVENTS = gql`
query GetEvents{
    getEvents{
        color
        title
        to
        from
        modifier
    }
}`;
