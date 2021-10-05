import { createStore } from 'redux';
import authReducer from './Auth/Reducer';

const store = createStore(authReducer);

export default store;
