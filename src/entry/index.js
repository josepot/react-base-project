import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';
import {connectRouter} from 'connected-react-router';

import rootReducer from 'modules/root-reducer';
import rootSaga from 'modules/root-saga';
import App from 'App';

import configureStore from './store';
import Providers from './Providers';

const history = createBrowserHistory();

export const render = (AppComponent, store) => {
  ReactDOM.render(
    <Providers store={store}>
      <AppComponent />
    </Providers>,
    document.getElementById('root')
  );
};

const routerEnhancer = connectRouter(history);
const reducer = routerEnhancer(rootReducer);

export const store = configureStore(reducer, history);
store.sagaTask = store.runSaga(rootSaga);

render(App, store);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept(
    ['../App', '../modules/root-reducer', '../modules/root-saga'],
    () => {
      store.replaceReducer(reducer);
      store.sagaTask.cancel();
      store.sagaTask.done.then(() => {
        store.sagaTask = store.runSaga(rootSaga);
        render(App, store);
      });
    }
  );
}
