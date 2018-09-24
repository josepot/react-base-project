import {compose, partialRight, prop} from 'ramda';
import {matchPath} from 'react-router';
import {createSelector} from 'reselect';
import rereducer, {getPayload} from 'rereducer';
import {createBrowserHistory} from 'history';
import {eventChannel} from 'redux-saga';
import {call, put, takeEvery} from 'redux-saga/effects';
import {createTypes} from 'action-helpers';

export const history = createBrowserHistory();

// ACTIONS
export const {LOCATION_CHANGE, HISTORY_METHOD_CALL} = createTypes('ROUTER', [
  'LOCATION_CHANGE',
  'HISTORY_METHOD_CALL',
]);

const onLocationChange = (location, action) => ({
  type: LOCATION_CHANGE,
  payload: {location, action},
});

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

// REDUCER
export default rereducer({location: {}, action: null}, [
  LOCATION_CHANGE,
  getPayload,
]);

// SELECTORS
const getRouter = prop('router');
export const getLocation = createSelector(getRouter, prop('location'));
export const getAction = createSelector(getRouter, prop('action'));
export const getPathname = createSelector(getLocation, prop('pathname'));
export const createMatchSelector = path =>
  createSelector(getPathname, partialRight(matchPath, [path]));

// SAGAS
const historyChannel = eventChannel(emit =>
  history.listen(
    compose(
      emit,
      onLocationChange
    )
  )
);

function* historyCallsWatcher({payload: {method, args}}) {
  yield call([history, history[method]], args);
}

export function* saga() {
  yield takeEvery(historyChannel, put);
  yield takeEvery(HISTORY_METHOD_CALL, historyCallsWatcher);
  yield put(onLocationChange(history.location));
}
