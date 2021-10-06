import { INC_CURRENT_STEP, DEC_CURRENT_STEP, UPDATE_USER_DATA } from './auth.types';

// eslint-disable-next-line import/prefer-default-export
export const updateUserData = (form) => ({
  type: UPDATE_USER_DATA,
  payload: form,
});

export const incCurrentStep = () => ({
  type: INC_CURRENT_STEP,
});

export const decCurrentStep = () => ({
  type: DEC_CURRENT_STEP,
});
