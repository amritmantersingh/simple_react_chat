import auth from './auth';
import register from './register';
import common from './common';
import { combineReducers } from 'redux';

export default combineReducers ({
    auth,
    register,
    common
});