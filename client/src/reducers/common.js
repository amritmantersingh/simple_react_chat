import {
  LOGIN,
    LOADING_START,
    LOADING_FINISHED,
  REGISTER,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ASYNC_START,
  UPDATE_FIELD_AUTH
} from '../constants/actionTypes';

const initialState = {
    loginStatus: false,
    loading: false
};
//
export default (state = initialState, action) => {

  switch (action.type) {
    case LOGIN:
      return {
          ...state,
          loginStatus: true,
      };
    case LOADING_START:
      return {
          ...state,
          loading: true,
      };
    case LOADING_FINISHED:
      return {
          ...state,
          loading: false,
      };
    default:
      return state;
  }

  return state;

};
