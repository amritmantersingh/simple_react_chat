import React from 'react';
import ReactDOM from 'react-dom';
// import './css/styles.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAwesomeApp from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store';

const App = () => (
    <MuiThemeProvider>
        <MyAwesomeApp />
    </MuiThemeProvider>
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
document.getElementById('root')
);
registerServiceWorker();
