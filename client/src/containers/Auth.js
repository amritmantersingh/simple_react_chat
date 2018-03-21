import React, { Component } from 'react';
import { Route, Switch, BrowserRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import { connect } from 'react-redux';
import { UPDATE_FIELD_AUTH, LOGIN, SUBMIT_AUTH_FORM, LOADING_START, LOADING_FINISHED, LOGIN_ERROR} from '../constants/actionTypes';
import agent from '../agent';
import { sessionService } from 'redux-react-session';

const BASE_URL = 'https://localhost:8000/';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onChangeUsetrname: value =>
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
                            const { token } = res;
                            sessionService.saveSession({ token })
                                .then(() => {
                                    sessionService.saveUser(res.data)
                                }).catch(err => console.error(err));
                            console.log(token);
                        } else if (res.data.status === 0) {
                            dispatch({type: LOGIN_ERROR, payload: res.data.message})
                        }
                        dispatch({type: LOADING_FINISHED});
                    }),
        })
    },
    onLogout: () => {
        //sessionService.deleteSession();
        //sessionService.deleteUser()
    }
});

class Auth extends Component {

    constructor(props) {
        super(props);
        this.changeUserName = ev => this.props.onChangeUsetrname(ev.target.value);
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
                <RaisedButton
                    label="LOGOUT"
                    primary={true}
                    fullWidth={true}
                    onClick={this.logOut()}
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

// class SignUpForm extends Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             user: {
//                 userName: '',
//                 userPassword: '',
//                 userPasswordConfirm: '',
//                 userEmail: ''
//             }
//         }
//     }
//
//     handleInputChange = (event) => {
//         const target = event.target;
//         const value = target.type === 'checkbox' ? target.checked : target.value;
//         const name = target.name;
//         this.setState({
//             user: {
//                 ...this.state.user,
//                 [name]: value
//             }
//         });
//     };
//     submitForm = () => {
//
//         let user = this.state.user;
//
//         axios.get('http://localhost:8000/api/usercheck/'+user.userName)
//             .then((res)=>{
//             let data = res.data;
//                 if (typeof data !== 'undefined' && data.length === 0 && Array.isArray(data)) {
//                     return true;
//                 } else {
//                     alert('Sorry, please choose another name');
//                     return false;
//                 }
//             }).then((res) => {
//             res ? (() => {
//                 if (user.userPassword && user.userPassword === user.userPasswordConfirm) {
//                     axios.post('http://localhost:8000/api/users', {
//                         username: user.userName,
//                         password: user.userPassword,
//                         password_confirm: user.userPasswordConfirm,
//                         email: user.userEmail
//                     }, {headers: {"Content-Type": "application/json"}})
//                         .then(function (response) {
//                             console.log(response);
//                         })
//                         .catch(function (error) {
//                             console.log(error);
//                         });
//                 } else {
//                     alert('Retype your password confirm')
//                 }
//             }
//         )() : null;
//         });
//
//     };
//
//     render () {
//
//         return (
//             <Paper zDepth={2} style={AUTH_FORM_CARD_STYLES}>
//                 <h3>Sign up</h3>
//                 <TextField
//                     onChange={this.handleInputChange}
//                     value={this.state.user.userName}
//                     name="userName"
//                     type="text"
//                     fullWidth={true}
//                     floatingLabelText="USERNAME"
//                 />
//                 <TextField
//                     onChange={this.handleInputChange}
//                     value={this.state.user.userEmail}
//                     name="userEmail"
//                     type="text"
//                     floatingLabelText="EMAIL"
//                     fullWidth={true}
//                 />
//                 <TextField
//                     onChange={this.handleInputChange}
//                     value={this.state.user.userPassword}
//                     name="userPassword"
//                     type="password"
//                     floatingLabelText="PASSWORD"
//                     fullWidth={true}
//                 />
//                 <TextField
//                     onChange={this.handleInputChange}
//                     value={this.state.user.userPasswordConfirm}
//                     name="userPasswordConfirm"
//                     type="password"
//                     floatingLabelText="CONFIRM PASSWORD"
//                     fullWidth={true}
//                 />
//                 <br/>
//                 <br/>
//                 <RaisedButton
//                     label="SIGN UP"
//                     primary={true}
//                     fullWidth={true}
//                     onClick={this.submitForm}
//                 />
//                 <br/>
//                 <br/>
//                 <RaisedButton
//                     label="SIGN IN"
//                     fullWidth={true}
//                     href="/register"
//                 />
//             </Paper>
//         )
//     }
//
// }
//
// class SignInForm extends Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             user: {
//                 userName: '',
//                 userPassword: ''
//             }
//         }
//     }
//
//     handleInputChange = (event) => {
//         const target = event.target;
//         const value = target.type === 'checkbox' ? target.checked : target.value;
//         const name = target.name;
//
//         this.setState({
//             user: {
//                 [name]: value
//             }
//         });
//     };
//     submitForm = () => {
//
//     };
//
//     render () {
//         return (
//             <div>
//
//             </div>
//
//         )
//     }
//
// }
