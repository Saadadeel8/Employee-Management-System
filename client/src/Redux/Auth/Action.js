import { INC_CURRENT_STEP, DEC_CURRENT_STEP, UPDATE_USER_DATA } from './Type';

// eslint-disable-next-line import/prefer-default-export
export const userDataUpdate = (form) => ({
  type: UPDATE_USER_DATA,
  payload: form,
});

export const goForward = () => ({
  type: INC_CURRENT_STEP,
});

export const goBack = () => ({
  type: DEC_CURRENT_STEP,
});
