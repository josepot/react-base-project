import React, {useMemo} from 'react';
import {itemSelector} from 'modules/items';
import {useReduxState} from 'lib/hooks';
import Item from './Item.Component';

export default props => {
  const stateProps = useReduxState(itemSelector, props);
  return useMemo(() => <Item {...stateProps} />, [stateProps]);
};
