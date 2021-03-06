import {
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import {items as itemsApi} from 'api';
import {combineReducers} from 'redux';
import {createSelector, createKeySelector} from 'redux-views';
import {
  always,
  compose,
  converge,
  dissoc,
  equals,
  map,
  merge,
  nthArg,
  prop,
  propOr,
  values,
  zipObj,
} from 'ramda';
import {createMatchSelector, takeLocation} from 'modules/router';
import rereducer, {assocReducer, concatReducer, payload} from 'rereducer';
import {createTypes, raiseAction} from 'action-helpers';

const PAGE_SIZE = 100;

const {addItem, getItem, getItems} = itemsApi;

// ACTIONS
const ACTIONS = createTypes('ITEMS', [
  'ITEMS_REQUESTED',
  'ITEMS_RECEIVED',
  'ITEM_REQUESTED',
  'ITEM_RECEIVED',
  'ADD_ITEM_REQUESTED',
  'ITEM_ADDED',
]);

// ACTION CREATORS
export const [
  requestItems,
  itemsReceived,
  requestItem,
  itemReceived,
  onSubmit,
] = [
  ACTIONS.ITEMS_REQUESTED,
  ACTIONS.ITEMS_RECEIVED,
  ACTIONS.ITEM_REQUESTED,
  ACTIONS.ITEM_RECEIVED,
  ACTIONS.ADD_ITEM_REQUESTED,
].map(raiseAction);

// REDUCER(S)
const isListLoading = rereducer(
  false,
  [ACTIONS.ITEMS_REQUESTED, always(true)],
  [ACTIONS.ITEMS_RECEIVED, always(false)]
);

const getState = nthArg(0);
const idsFromPayload = compose(
  map(prop('id')),
  payload()
);
const valuesFromPayload = compose(
  values,
  payload()
);
const idsList = rereducer(
  [],
  [ACTIONS.ITEMS_RECEIVED, concatReducer(idsFromPayload)]
);

const payloadListToDict = converge(zipObj, [idsFromPayload, valuesFromPayload]);
const addItems = converge(merge, [payloadListToDict, getState]);
const updateItem = assocReducer(payload('id'), payload());
const itemsDict = rereducer(
  {},
  [ACTIONS.ITEMS_RECEIVED, addItems],
  [ACTIONS.ITEM_RECEIVED, updateItem]
);

const loadingItems = rereducer(
  {},
  [ACTIONS.ITEM_REQUESTED, assocReducer(payload(), true)],
  [ACTIONS.ITEM_RECEIVED, converge(dissoc, [payload('id'), getState])]
);

export default combineReducers({
  idsList,
  isListLoading,
  itemsDict,
  loadingItems,
});

// SELECTORS
const itemsRootSelector = prop('items');
export const idsListSelector = createSelector(
  [itemsRootSelector],
  prop('idsList')
);
export const isListLoadingSelector = createSelector(
  [itemsRootSelector],
  prop('isListLoading')
);
export const itemsDictSelector = createSelector(
  [itemsRootSelector],
  prop('itemsDict')
);
export const loadingItemsSelector = createSelector(
  [itemsRootSelector],
  prop('loadingItems')
);

const idMatchSelector = createMatchSelector('/list/:id');
export const selectedIdSelector = createSelector(
  [idMatchSelector],
  match => match && match.params.id
);

const propIdSelector = createKeySelector(({id}) => id);

const isItemLoadingSelector = createSelector(
  [propIdSelector, loadingItemsSelector],
  propOr(false)
);

const isItemSelectedSelector = createSelector(
  [propIdSelector, selectedIdSelector],
  equals
);

const rawItemSelector = createSelector(
  [propIdSelector, itemsDictSelector],
  propOr({})
);

export const itemSelector = createSelector(
  [rawItemSelector, isItemLoadingSelector, isItemSelectedSelector],
  (item, isLoading, isSelected) => ({
    ...item,
    isLoading,
    isSelected,
  })
);

// SAGAS
function* itemEntered(id) {
  const {author, price, isLoading} = yield select(itemSelector, {id});
  if (author === undefined && price === undefined && !isLoading) {
    yield put(requestItem(id));
  }
}

function* itemEnteredWatcher() {
  while (true) {
    const {
      params: {id},
    } = yield takeLocation('/list/:id');
    yield fork(itemEntered, id);
  }
}

function* itemSaga({payload: id}) {
  const item = yield call(getItem, id);
  yield put(itemReceived(item));
}

function* itemsSaga() {
  const {length} = yield select(idsListSelector);
  const result = yield call(getItems, length, PAGE_SIZE);
  yield put(itemsReceived(result));
}

let onSubmitCb = Function.prototype;
export const onItemSubmitted = cb => {
  onSubmitCb = cb;
};

function* addItemSaga({payload: {title, author, price}}) {
  const item = yield call(addItem, title, author, price);
  yield call(onSubmitCb);
  yield put(itemReceived(item));
}

function* requestItemsIfEmpty() {
  const ids = yield select(idsListSelector);
  if (ids.length > 0) return;
  yield put(requestItems());
}

export function* saga() {
  yield takeLatest(ACTIONS.ITEMS_REQUESTED, itemsSaga);
  yield takeEvery(ACTIONS.ITEM_REQUESTED, itemSaga);
  yield takeEvery(ACTIONS.ADD_ITEM_REQUESTED, addItemSaga);
  yield fork(itemEnteredWatcher);
  yield fork(requestItemsIfEmpty);
}
