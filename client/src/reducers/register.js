import {
  UPDATE_FIELD_REGISTER, NEW_USER_REGISTERED, REDIRECTED_TO_LOGIN_FORM
} from '../constants/actionTypes';

const initialState = {
    userName: '',
    userEmail: '',
    userPassword: '',
    userPasswordConfirm: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NEW_USER_REGISTERED:
      return {
        ...initialState,
          ...state,
          redirect: true,
        inProgress: false,
      };
    case REDIRECTED_TO_LOGIN_FORM: {
      return {
        ...state,
          redirect: false
      }
    }
    case UPDATE_FIELD_REGISTER:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }

  return state;
};
