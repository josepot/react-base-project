import {createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';

const devMode = process.env.NODE_ENV !== 'production';

const sagaMiddleware = createSagaMiddleware();

const getEnhancers = () =>
  devMode && window.devToolsExtension ? [window.devToolsExtension()] : [];

export default (reducer, history) => {
  const common = [routerMiddleware(history), sagaMiddleware];
  const env =
    process.env.NODE_ENV !== 'production'
      ? [require('redux-logger').default] // eslint-disable-line global-require
      : [];
  const middlewares = [...env, ...common];
  const store = compose(
    applyMiddleware(...middlewares),
    ...getEnhancers()
  )(createStore)(reducer);
  store.runSaga = sagaMiddleware.run;
  store.history = history;
  return store;
};
