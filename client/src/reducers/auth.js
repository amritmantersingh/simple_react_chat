import {
  CHECK_AUTH_TOKEN,
  UNCHECK_AUTH_TOKEN,
  LOGIN,
  REGISTER,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ASYNC_START,
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
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return {};
    case ASYNC_START:
      if (action.subtype === LOGIN || action.subtype === REGISTER) {
        return { ...state, inProgress: true };
      }
      break;
    case UPDATE_FIELD_AUTH:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }

  return state;
};
