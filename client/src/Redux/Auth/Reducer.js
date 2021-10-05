import { UPDATE_USER_DATA, INC_CURRENT_STEP, DEC_CURRENT_STEP } from './Type';

const initialState = {
  currentStep: 0,
  userData: {},
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
    default: return state;
  }
};

export default authReducer;
