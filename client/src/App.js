import React, { Component } from 'react';
import { Route, Router, Switch, BrowserRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'
import { connect } from 'react-redux'
import axios from 'axios';
import Paper from 'material-ui/Paper';
import Chat from './containers/Chat';
import Auth from './containers/Auth';
import Registration from './containers/Register';
import CircularProgress from 'material-ui/CircularProgress';
import { sessionService } from 'redux-react-session';
import PrivateRoute from './containers/PrivateRoute';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import agent from './agent';
import {CHECK_AUTH_TOKEN, LOADING_START, LOADING_FINISHED, UNCHECK_AUTH_TOKEN} from './constants/actionTypes';


const history = createHistory();

const CONTAINER_STYLES = {
    'width': '320px',
    'margin': '200px auto',
    'padding': '16px',
    'textAlign': 'center',
    'minHeight': '375px',
    'boxSizing': 'border-box',
    'position': 'relative',
    'overflow': 'hidden'
};
const LOADER_STYLES = {
    'position': 'absolute',
    'left': '0',
    'right': '0',
    'bottom': '0',
    'top': '0',
    'margin': 'auto'
};

const mapStateToProps = state => ({ ...state.auth, ...state.common });

const mapDispatchToProps = dispatch => ({
    onLoad: () =>
    {
        dispatch({type: LOADING_START});
        agent.Auth.check().then(
        res => {
            if (res.data.success) {
                dispatch({type: CHECK_AUTH_TOKEN, payload: res.data.user});
            } else {
                window.localStorage.removeItem('token');
                dispatch({type: UNCHECK_AUTH_TOKEN});
            }
            dispatch({type: LOADING_FINISHED});
        });
    }
});

class MyAwesomeApp extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount () {
        this.props.onLoad();
    }
    render() {

        const authenticated = this.props.session ? this.props.session.authenticated : false;

        if (!this.props.loading) {
            return (

                <div className="wrapper">
                    <Paper className="container" zDepth={2} style={CONTAINER_STYLES}>
                        <Switch>
                            <Router history={history}>

                                <div>
                                    <PrivateRoute exact path="/chat" component={Chat} authenticated={authenticated} redirect="/"/>
                                    <PrivateRoute exact path="/" component={Auth} authenticated={!authenticated} redirect="/chat"/>
                                    <Route path='/register' component={ Registration }/>
                                </div>

                            </Router>

                        </Switch>
                    </Paper>
                </div>

            );
        } else {
            return (
                <div className="wrapper">
                    <Paper className="container" zDepth={2} style={CONTAINER_STYLES}>
                        <CircularProgress size={80} thickness={5} style={LOADER_STYLES}/>
                    </Paper>
                </div>
            )

        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAwesomeApp);