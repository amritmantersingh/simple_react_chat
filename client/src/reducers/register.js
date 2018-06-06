import {
  UPDATE_FIELD_REGISTER, NEW_USER_REGISTERED, REDIRECTED_TO_LOGIN_FORM, UPDATE_REGISTRATION_ERRORS
} from '../constants/actionTypes';

const initialState = {
  userName: '',
  userEmail: '',
  userPassword: '',
  userPasswordConfirm: '',
  errors: {}
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
    case UPDATE_REGISTRATION_ERRORS:
      return { ...state, errors: action.payload};
    default:
      return state;
  }

  return state;
};
