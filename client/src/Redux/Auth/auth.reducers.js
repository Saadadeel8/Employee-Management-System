import {
  UPDATE_USER_DATA, INC_CURRENT_STEP, DEC_CURRENT_STEP, USER_LOGIN, USER_LOGOUT,
} from './auth.types';

const initialState = {
  currentStep: 0,
  userData: {},
  loggedInUser: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case INC_CURRENT_STEP:
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case DEC_CURRENT_STEP:
      return {
        ...state,
        currentStep: state.currentStep - 1,
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: { ...state.userData, ...action.payload },
      };
    case USER_LOGIN:
      return {
        ...state,
        loggedInUser: action.payload,
      };
    case USER_LOGOUT:
      return {
        ...state,
        loggedInUser: null,
      };
    default: return state;
  }
};

export default authReducer;
