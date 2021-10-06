import './App.css';
import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Provider } from 'react-redux';
import Routes from './Helpers/Routes';
import store from './Redux/Store';

const errorLink = onError(({ graphqlErrors }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message }) => alert(`Graphql error ${message}`));
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: 'http://localhost:5000/graphql' }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Routes />
      </ApolloProvider>
    </Provider>
  );
}

export default App;
