import {all, fork} from 'redux-saga/effects';
import {saga as items} from './items';

export default function*() {
  yield all([items].map(fork));
}
