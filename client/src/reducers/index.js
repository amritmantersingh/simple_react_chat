import auth from './auth';
import register from './register';
import common from './common';
import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';

export default combineReducers ({
    auth,
    register,
    common,
    session: sessionReducer
});