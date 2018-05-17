import React, { Component } from 'react';
import { Route, Switch, BrowserRouter, Link, Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import agent from '../agent';
import { connect } from 'react-redux';
import {
    NEW_USER_REGISTERED, LOGIN, UPDATE_FIELD_REGISTER, UPDATE_FIELD_AUTH, REDIRECTED_TO_LOGIN_FORM,
    LOADING_START, LOADING_FINISHED
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
        agent.Reg.register(username, email, password, passwordConfirm);
        dispatch({ type: LOADING_FINISHED })
        ).then(()=>{dispatch({ type: NEW_USER_REGISTERED })})
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
            console.log(this.props);
            ev.preventDefault();
            this.props.onSubmit( this.props.userName, this.props.userEmail, this.props.userPassword, this.props.userPasswordConfirm );
            this.props.onChangeUser(this.props.userName);
            this.props.onChangePass(this.props.userPassword);
            this.props.onRedirect()
        };
    }

    render () {
        if (this.props.redirect) {
            <Redirect to='/'/>
        }
        return (
            <div>
                <h3>Sign up</h3>
                <TextField
                    onChange={this.changeUserName}
                    defaultValue={this.props.userName}
                    name="userName"
                    type="text"
                    fullWidth={true}
                    floatingLabelText="USERNAME"
                />
                <TextField
                    onChange={this.changeEmail}
                    defaultValue={this.props.userEmail}
                    name="userEmail"
                    type="text"
                    floatingLabelText="EMAIL"
                    fullWidth={true}
                />
                <TextField
                    onChange={this.changePassword}
                    defaultValue={this.props.userPassword}
                    name="userPassword"
                    type="password"
                    floatingLabelText="PASSWORD"
                    fullWidth={true}
                />
                <TextField
                    onChange={this.changePasswordConfirm}
                    defaultValue={this.props.userPasswordConfirm}
                    name="userPasswordConfirm"
                    type="password"
                    floatingLabelText="CONFIRM PASSWORD"
                    fullWidth={true}
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
                    style={{
                        "display": "block",
                        "height": "100%"
                    }}
                >
                    <RaisedButton
                        label="SIGN IN"
                        fullWidth={true}
                    />
                </Link>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);

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
//                 let data = res.data;
//                 if (typeof data !== 'undefined' && data.length === 0 && Array.isArray(data)) {
//                     return true;
//                 } else {
//                     alert('Sorry, please choose another name');
//                     return false;
//                 }
//             }).then((res) => {
//             res ? (() => {
//                     if (user.userPassword && user.userPassword === user.userPasswordConfirm) {
//                         axios.post('http://localhost:8000/api/users', {
//                             username: user.userName,
//                             password: user.userPassword,
//                             password_confirm: user.userPasswordConfirm,
//                             email: user.userEmail
//                         }, {headers: {"Content-Type": "application/json"}})
//                             .then(function (response) {
//                                 console.log(response);
//                             })
//                             .catch(function (error) {
//                                 console.log(error);
//                             });
//                     } else {
//                         alert('Retype your password confirm')
//                     }
//                 }
//             )() : null;
//         });
//
//     };
//
//     render () {
//
//         return (
//
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
