import React, { Component } from 'react';
import { Route, Router, Switch, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import axios from 'axios';
import Paper from 'material-ui/Paper';
import Chat from './containers/Chat.js';
import Auth from './containers/Auth';
import Registration from './containers/Register';
import CircularProgress from 'material-ui/CircularProgress';
import { sessionService } from 'redux-react-session';
import PrivateRoute from './containers/PrivateRoute'

const CONTAINER_STYLES = {
    'width': '320px',
    'margin': '200px auto',
    'padding': '16px',
    'textAlign': 'center',
    'minHeight': '375px',
    'boxSizing': 'border-box',
    'position': 'relative'
};
const LOADER_STYLES = {
    'position': 'absolute',
    'left': '0',
    'right': '0',
    'bottom': '0',
    'top': '0',
    'margin': 'auto'
};

const mapStateToProps = state => ({ ...state.common, ...state.session });

class MyAwesomeApp extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount () {

    }
    render() {

        console.log(this.props)

        let authenticated = true // this.props.authenticated;
        let checked = true //this.props.checked;

        if (!this.props.loading) {
            return (

                <div className="wrapper">
                    <Paper zDepth={2} style={CONTAINER_STYLES}>
                        <Switch>

                                { checked &&
                                <div>
                                    <PrivateRoute exact path="/" component={Chat} authenticated={authenticated}/>
                                    <Route path="/login" component={Auth}/>
                                    <Route path='/register' component={ Registration }/>
                                </div>
                                }

                            {/*<PrivateRoute>*/}
                                {/**/}
                            {/*</PrivateRoute>*/}
                            {/*<Route exact path="/" component={ Chat } />*/}
                            {/*<Route path='/login' component={ Auth }></Route>*/}

                            {/*<Route path='/auth' render={(props) => (*/}
                            {/*<Chat {...props} />*/}
                            {/*)}/>*/}
                        </Switch>
                    </Paper>
                </div>

            );
        } else {
            return (
                <div className="wrapper">
                    <Paper zDepth={2} style={CONTAINER_STYLES}>
                        <CircularProgress size={80} thickness={5} style={LOADER_STYLES}/>
                    </Paper>
                </div>
            )

        }

    }
}

export default connect(mapStateToProps)(MyAwesomeApp);