import React, {useMemo} from 'react';
import {useReduxState, useReduxActions, useOnScrollBottom} from 'hooks';
import createSelector from 'redux-views';
import {idsListSelector, requestItems} from 'modules/items';
import ListComponent from './List.Component';

const selector = createSelector(
  [idsListSelector],
  itemIds => ({itemIds})
);

const actions = {requestItems};

export default () => {
  const stateProps = useReduxState(selector);
  const actionProps = useReduxActions(actions);
  return useMemo(
    () => (
      <ListComponent
        {...{
          ...stateProps,
          onScroll: useOnScrollBottom(actionProps.requestItems),
        }}
      />
    ),
    [actionProps.requestItems, stateProps]
  );
};
