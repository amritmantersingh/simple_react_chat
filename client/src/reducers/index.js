import auth from './auth';
import register from './register';
import common from './common';
import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';
import { routerReducer } from 'react-router-redux'

export default combineReducers ({
    auth,
    register,
    common,
    session: sessionReducer,
    routing: routerReducer
});