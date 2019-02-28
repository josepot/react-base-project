import React, {useMemo, memo} from 'react';
import {useReduxState, useReduxActions, useOnScrollBottom} from 'hooks';
import createSelector from 'redux-views';
import {idsListSelector, requestItems} from 'modules/items';
import OListComponent from './List.Component';

const ListComponent = memo(OListComponent);

const selector = createSelector(
  [idsListSelector],
  itemIds => ({itemIds})
);

const actions = {requestItems};

export default () => {
  const stateProps = useReduxState(selector);
  const actionProps = useReduxActions(actions);
  return useMemo(() => {
    console.log('inside list memo');
    const res = (
      <ListComponent
        {...{
          ...stateProps,
          onScroll: useOnScrollBottom(actionProps.requestItems),
        }}
      />
    );
    return res;
  }, [actionProps.requestItems, stateProps]);
};
