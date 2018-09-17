import {call, fork, put, select, takeEvery, take} from 'redux-saga/effects';
import {items as itemsApi} from 'api';
import {combineReducers} from 'redux';
import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
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
import {LOCATION_CHANGE, createMatchSelector} from 'connected-react-router';
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
  itemsRootSelector,
  prop('idsList')
);
export const isListLoadingSelector = createSelector(
  itemsRootSelector,
  prop('isListLoading')
);
export const itemsDictSelector = createSelector(
  itemsRootSelector,
  prop('itemsDict')
);
export const loadingItemsSelector = createSelector(
  itemsRootSelector,
  prop('loadingItems')
);

const idMatchSelector = createMatchSelector('/list/:id');
export const selectedIdSelector = createSelector(
  idMatchSelector,
  match => (match && parseInt(match.params.id, 10)) || null
);

const propIdSelector = (state, {id}) => id;

const isItemLoadingSelector = createCachedSelector(
  [propIdSelector, loadingItemsSelector],
  propOr(false)
)(propIdSelector);

const isItemSelectedSelector = createCachedSelector(
  [propIdSelector, selectedIdSelector],
  equals
)(propIdSelector);

const rawItemSelector = createCachedSelector(
  [propIdSelector, itemsDictSelector],
  prop
)(propIdSelector);

export const itemSelector = createCachedSelector(
  [rawItemSelector, isItemLoadingSelector, isItemSelectedSelector],
  (item, isLoading, isSelected) => ({
    ...item,
    isLoading,
    isSelected,
  })
)(propIdSelector);

// SAGAS
function* itemSaga({payload: id}) {
  const item = yield call(getItem, id);
  yield put(itemReceived(item));
}

function* itemsSaga() {
  while (true) {
    yield take(ACTIONS.ITEMS_REQUESTED);
    const {length} = yield select(idsListSelector);
    const result = yield call(getItems, length, PAGE_SIZE);
    yield put(itemsReceived(result));
  }
}

function* locationChangeWatcher() {
  const id = yield select(selectedIdSelector);
  if (id === null) return;
  const item = yield select(itemSelector, {id});
  if (
    !item ||
    (item.author === undefined && item.price === undefined && !item.isLoading)
  ) {
    yield put(requestItem(id));
  }
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

export function* saga() {
  yield fork(itemsSaga);
  yield takeEvery(ACTIONS.ITEM_REQUESTED, itemSaga);
  yield takeEvery(LOCATION_CHANGE, locationChangeWatcher);
  yield takeEvery(ACTIONS.ADD_ITEM_REQUESTED, addItemSaga);
  yield put(requestItems());
}
