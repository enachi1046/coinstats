import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-loading-promise-middleware';
// import { createLogger } from 'redux-logger';

import reducers from './reducers';

// const logger = createLogger({});

const middleware = applyMiddleware(
  // logger,
  thunk,
  promise,
);

export default createStore(reducers, middleware);
