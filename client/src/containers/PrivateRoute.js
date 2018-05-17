import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component, exact = false, path, authenticated, redirect }) => (
  <Route
    exact={exact}
    path={path}
    render={props => (
      authenticated ? (
          React.createElement(component, props)
      ) : (
        <Redirect to={{
          pathname: redirect,
          state: { from: props.location }
        }}/>
      )
    )}
  />
);

const { object, bool, string, func } = PropTypes;

PrivateRoute.propTypes = {
  component: func.isRequired,
  exact: bool,
  path: string.isRequired,
  location: object
};

export default PrivateRoute;
