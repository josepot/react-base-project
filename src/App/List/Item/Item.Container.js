import React, {useMemo, memo} from 'react';
import {itemSelector} from 'modules/items';
import {useReduxState} from 'lib/hooks';
import Item from './Item.Component';

const MItem = memo(Item);

export default props => {
  const finalProps = useReduxState(itemSelector, props);
  return useMemo(() => <MItem {...finalProps} />, [finalProps]);
};
