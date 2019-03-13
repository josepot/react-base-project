import React, {useMemo} from 'react';
import {itemSelector} from 'modules/items';
import {useReduxState} from 'react-redux-lean';
import Item from './Item.Component';

export default props => {
  const stateProps = useReduxState(itemSelector, props);
  return useMemo(() => <Item {...stateProps} />, [stateProps]);
};
