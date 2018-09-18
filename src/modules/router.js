import {compose, prop} from 'ramda';
import {matchPath} from 'react-router';
import {createSelector} from 'reselect';
import rereducer, {getPayload} from 'rereducer';
import {createBrowserHistory} from 'history';
import {eventChannel} from 'redux-saga';
import {call, put, take, takeEvery} from 'redux-saga/effects';
import {createTypes} from 'action-helpers';

export const history = createBrowserHistory();

// ACTIONS
export const {LOCATION_CHANGE, HISTORY_METHOD_CALL} = createTypes('ROUTER', [
  'LOCATION_CHANGE',
  'HISTORY_METHOD_CALL',
]);

function updateLocation(method) {
  return (...args) => ({
    type: HISTORY_METHOD_CALL,
    payload: {method, args},
  });
}

export const push = updateLocation('push');
export const replace = updateLocation('replace');
export const go = updateLocation('go');
export const goBack = updateLocation('goBack');
export const goForward = updateLocation('goForward');

const onLocationChange = (location, action) => ({
  type: LOCATION_CHANGE,
  payload: {location, action},
});

// REDUCER
export default rereducer({location: null, action: null}, [
  LOCATION_CHANGE,
  getPayload,
]);

// SELECTORS
const getRouter = prop('router');
export const getLocation = createSelector(getRouter, prop('location'));
export const getAction = createSelector(getRouter, prop('action'));
export const createMatchSelector = path => {
  let lastPathname = null;
  let lastMatch = null;
  return state => {
    const {pathname} = getLocation(state) || {};
    if (pathname === lastPathname) {
      return lastMatch;
    }
    lastPathname = pathname;
    const match = matchPath(pathname, path);
    if (!match || !lastMatch || match.url !== lastMatch.url) {
      lastMatch = match;
    }
    return lastMatch;
  };
};

// SAGAS
function* locationChangeWatcher() {
  const historyChannel = eventChannel(emit =>
    history.listen(
      compose(
        emit,
        onLocationChange
      )
    )
  );

  while (true) {
    const action = yield take(historyChannel);
    yield put(action);
  }
}

function* historyCallsWatcher({payload: {method, args}}) {
  yield call([history, history[method]], args);
}

export function* saga() {
  yield call(locationChangeWatcher);
  yield takeEvery(HISTORY_METHOD_CALL, historyCallsWatcher);
  yield put(onLocationChange(history.location));
}
