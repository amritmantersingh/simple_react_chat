import auth from './auth';
import register from './register';
import common from './common';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

export default combineReducers ({
    auth,
    register,
    common,
    routing: routerReducer
});