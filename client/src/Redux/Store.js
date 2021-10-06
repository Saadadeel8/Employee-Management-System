import { createStore } from 'redux';
import authReducer from './Auth/auth.reducers';

const store = createStore(authReducer);

export default store;
