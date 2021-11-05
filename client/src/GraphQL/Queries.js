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
export const GET_POSTS = gql`
query GetPosts{
    getPosts{
        id
        body
        user
        username
        createdAt
        comments{ 
        body 
        username
        createdAt
        }
    }
}`;
export const GET_COMMENTS = gql`
query GetComments{
    getComments{
        body
        username
        createdAt
    }
}`;
export const GET_LIKES = gql`
query GetLikes{
    getComments{
        body
        username
        createdAt
    }
}`;