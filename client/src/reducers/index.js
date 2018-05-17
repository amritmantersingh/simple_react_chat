import auth from './auth';
import register from './register';
import common from './common';
import chat from './chat';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

export default combineReducers ({
    auth,
    register,
    common,
    chat,
    routing: routerReducer
});