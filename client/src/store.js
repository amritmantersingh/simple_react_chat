import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/';

const store = configureStore();

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