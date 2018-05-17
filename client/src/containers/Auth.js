import React, { Component } from 'react';
import { Route, Switch, BrowserRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import { connect } from 'react-redux';
import { CHECK_AUTH_TOKEN, UPDATE_FIELD_AUTH, LOGIN, SUBMIT_AUTH_FORM, LOADING_START, LOADING_FINISHED, LOGIN_ERROR} from '../constants/actionTypes';
import agent from '../agent';
import createHistory from 'history/createBrowserHistory'

const history = createHistory();

const BASE_URL = 'https://localhost:8000/';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onChangeUsername: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'userName', value}),
    onChangePassword: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'userPassword', value}),
    onSubmit: (username, password) => {
        dispatch({type: LOADING_START});
        dispatch({
            type: SUBMIT_AUTH_FORM,
            payload: agent.Auth.login(username, password)
                .then(
                    res => {
                        if (res.data.status === 1) {
                            dispatch({type: LOGIN});
                            const token = res.data.token;
                            window.localStorage.setItem('token', token);
                            dispatch({type: CHECK_AUTH_TOKEN, payload: {username: username}})
                        } else if (res.data.status === 0) {
                            dispatch({type: LOGIN_ERROR, payload: res.data.message})
                        }
                        dispatch({type: LOADING_FINISHED});
                    }),
        })
    }
});

class Auth extends Component {

    constructor(props) {
        super(props);
        this.changeUserName = ev => this.props.onChangeUsername(ev.target.value);
        this.changePassword = ev => this.props.onChangePassword(ev.target.value);
        this.submitForm = (username, password) => ev => {
            ev.preventDefault();
            this.props.onSubmit(username, password);
        };
        this.logOut = () => {
            this.props.onLogout();
        }
    }

    render () {
        const userName = this.props.auth.userName;
        const userPassword = this.props.auth.userPassword;
        const loginError = typeof this.props.auth.loginError === 'string' ? this.props.auth.loginError : '';
        return (
            <div>
                <h3>Sign in</h3>
                <TextField
                    onChange={this.changeUserName}
                    defaultValue={userName}
                    name="userName"
                    type="text"
                    fullWidth={true}
                    floatingLabelText="USERNAME"
                    errorText={loginError.length ? ' ' : ''}
                />
                <TextField
                    onChange={this.changePassword}
                    defaultValue={userPassword}
                    name="userPassword"
                    type="password"
                    floatingLabelText="PASSWORD"
                    fullWidth={true}
                    errorText={loginError}
                />
                <br/>
                <br/>
                <RaisedButton
                    label="SIGN IN"
                    primary={true}
                    fullWidth={true}
                    onClick={this.submitForm(userName, userPassword)}
                />
                <br/>
                <br/>
                <Link to="/register">
                    <RaisedButton
                        label="SIGN UP"
                        fullWidth={true}
                    />
                </Link>
            </div>
        )
    }
}

Auth.propTypes = {
    auth: PropTypes.shape({
        userName: PropTypes.string,
        userPassword: PropTypes.string
    })
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);