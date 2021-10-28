import './App.css';
import './Styles/Profile.css';
import React, { useEffect } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  createHttpLink,
} from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setContext } from '@apollo/client/link/context';
import { notification } from 'antd';
import { createUploadLink } from 'apollo-upload-client';
import Routes from './Helpers/Routes';
import { userLogin } from './Redux';

function App() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser !== loggedInUser) {
      dispatch(userLogin(currentUser));
    }
  }, []);

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = loggedInUser !== 'null' ? loggedInUser?.token : '';
    console.log(token);
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `${token}` : '',
      },
    };
  });

  const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
}

export default App;
