import {
  CHECK_AUTH_TOKEN,
  UNCHECK_AUTH_TOKEN,
  LOGIN,
  REGISTER,
  UPDATE_FIELD_AUTH,
  SUBMIT_AUTH_FORM,
    LOGIN_ERROR
} from '../constants/actionTypes';

const initialState = {
    userName: '',
    userPassword: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHECK_AUTH_TOKEN:
      return {
          ...state,
        session: {
          authenticated: true,
          user: action.payload
        }
      };
    case UNCHECK_AUTH_TOKEN:
      return {
          ...state,
          session: {
            authenticated: false,
            user: {}
          }
      };
    case SUBMIT_AUTH_FORM:
    case LOGIN_ERROR :
      return {
          ...state,
          loginError: action.payload
      };
    case REGISTER:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      };
    case UPDATE_FIELD_AUTH:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }

  return state;
};
