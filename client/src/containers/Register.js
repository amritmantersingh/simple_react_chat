import React, { Component } from 'react';
import { Route, Switch, BrowserRouter, Link, Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import agent from '../agent';
import { connect } from 'react-redux';
import {
    NEW_USER_REGISTERED, LOGIN, UPDATE_FIELD_REGISTER, UPDATE_FIELD_AUTH, REDIRECTED_TO_LOGIN_FORM,
    LOADING_START, LOADING_FINISHED, UNCHECK_AUTH_TOKEN
} from '../constants/actionTypes'

const BASE_URL = 'https://localhost:8000/';

const mapStateToProps = state => ({ ...state.register });

const mapDispatchToProps = dispatch => ({
    onChangeUserName: value =>
        dispatch({ type: UPDATE_FIELD_REGISTER, key: 'userName', value }),
    onChangeEmail: value =>
        dispatch({ type: UPDATE_FIELD_REGISTER, key: 'userEmail', value }),
    onChangePassword: value =>
        dispatch({ type: UPDATE_FIELD_REGISTER, key: 'userPassword', value }),
    onChangePasswordConfirm: value =>
        dispatch({ type: UPDATE_FIELD_REGISTER, key: 'userPasswordConfirm', value }),
    onSubmit: (username, email, password, passwordConfirm) => {
        dispatch({ type: LOADING_START })
        agent.Reg.register(username, email, password, passwordConfirm).then(
            function () {
                dispatch({ type: LOADING_FINISHED });
                dispatch({ type: NEW_USER_REGISTERED });
                window.localStorage.removeItem('token');
                dispatch({type: UNCHECK_AUTH_TOKEN});
            }
        )
    },
    onChangeUser: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'userName', value}),
    onChangePass: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'userPassword', value}),
    onRedirect: () => {
        dispatch({ type: REDIRECTED_TO_LOGIN_FORM })
    }
});

class Register extends Component {

    constructor(props) {
        super(props);
        this.changeUserName = ev => this.props.onChangeUserName(ev.target.value);
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changePassword = ev => this.props.onChangePassword(ev.target.value);
        this.changePasswordConfirm = ev => this.props.onChangePasswordConfirm(ev.target.value);
        this.submitForm = ev => {
            ev.preventDefault();
            this.props.onSubmit( this.props.userName, this.props.userEmail, this.props.userPassword, this.props.userPasswordConfirm );
            this.props.onChangeUser(this.props.userName);
            this.props.onChangePass(this.props.userPassword);
            this.props.onRedirect()
        };
    }
    handleKeyPress = (event) => {
        if(event.key == 'Enter'){
            event.preventDefault();
            this.submitForm();
        }
    }
    render () {
        if (this.props.redirect) {
            return <Redirect to='/'/>
        }
        return (
            <Paper className="container" zDepth={2}>
                <h3>Sign up</h3>
                <TextField
                    onChange={this.changeUserName}
                    defaultValue={this.props.userName}
                    name="userName"
                    type="text"
                    fullWidth={true}
                    floatingLabelText="USERNAME"
                    onKeyPress={this.handleKeyPress}
                />
                <TextField
                    onChange={this.changeEmail}
                    defaultValue={this.props.userEmail}
                    name="userEmail"
                    type="text"
                    floatingLabelText="EMAIL"
                    fullWidth={true}
                    onKeyPress={this.handleKeyPress}
                />
                <TextField
                    onChange={this.changePassword}
                    defaultValue={this.props.userPassword}
                    name="userPassword"
                    type="password"
                    floatingLabelText="PASSWORD"
                    fullWidth={true}
                    onKeyPress={this.handleKeyPress}
                />
                <TextField
                    onChange={this.changePasswordConfirm}
                    defaultValue={this.props.userPasswordConfirm}
                    name="userPasswordConfirm"
                    type="password"
                    floatingLabelText="CONFIRM PASSWORD"
                    fullWidth={true}
                    onKeyPress={this.handleKeyPress}
                />
                <br/>
                <br/>
                <RaisedButton
                    label="SIGN UP"
                    primary={true}
                    fullWidth={true}
                    onClick={this.submitForm}
                />
                <br/>
                <br/>
                <Link
                    to="/"
                >
                    <RaisedButton
                        label="SIGN IN"
                        fullWidth={true}
                    />
                </Link>
            </Paper>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);