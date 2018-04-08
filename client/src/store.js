import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/';
import { sessionService } from 'redux-react-session';

const store = configureStore();

const options = { refreshOnCheckAuth: false, redirectPath: '/', driver: 'LOCALSTORAGE', };
sessionService.initSessionService(store)
    .then(() => console.log('Redux React Session is ready and a session was refreshed from your storage'))
    .catch(() => console.log('Redux React Session is ready and there is no session in your storage'));

function configureStore(initialState) {

    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(thunk),
            window.devToolsExtension ? window.devToolsExtension() : f => f)
        );

    if (module.hot) {
        module.hot.accept('./reducers/', () => {
            const nextRootReducer = require('./reducers/')
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}

export default store;