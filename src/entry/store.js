import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const enhancers =
  process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? [window.__REDUX_DEVTOOLS_EXTENSION__()]
    : [];

export default reducer => {
  const common = [sagaMiddleware];
  const env =
    process.env.NODE_ENV !== 'production'
      ? [require('redux-logger').default] // eslint-disable-line global-require
      : [];
  const middlewares = [...env, ...common];
  const store = compose(
    applyMiddleware(...middlewares),
    ...enhancers
  )(createStore)(reducer);
  store.runSaga = sagaMiddleware.run;
  return store;
};
