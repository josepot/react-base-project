import {all, fork, takeEvery} from 'redux-saga/effects';
import {saga as items} from './items';
import {saga as router} from './router';

window.__actions = [];

const saveAction = action => window.__actions.push(action);

function* saveActions() {
  yield takeEvery('*', saveAction);
}

export default function*() {
  // yield fork(saveActions);
  yield all(
    [
      /*items, router*/
    ].map(fork)
  );
}
