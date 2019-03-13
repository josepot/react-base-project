import React, {useMemo} from 'react';
import {useRedux} from 'react-redux-lean';
import {getOnScrollBottom} from 'utils';
import {createStructuredSelector} from 'redux-views';
import {idsListSelector, requestItems} from 'modules/items';
import ListComponent from './List.Component';

const selector = createStructuredSelector({
  itemIds: idsListSelector,
});

const actions = {requestItems};

function listMapper(stateProps, actionProps) {
  return {
    ...stateProps,
    onScroll: getOnScrollBottom(actionProps.requestItems),
  };
}

export default () => {
  const props = useRedux(selector, actions, listMapper);
  return useMemo(() => <ListComponent {...props} />, [props]);
};
