import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducers';
import { initialState } from './initialState.js';

const logger = createLogger();
const composeEnhanced = window.__REDUX_DEVTOOLS_EXTENSTION_COMPOSE__ || compose;

function configureStore() {
  return createStore(
    reducer,
    initialState,
    composeEnhanced(applyMiddleware(thunkMiddleware, logger))
  );
}

export default configureStore;
