import React, {useMemo} from 'react';
import {itemSelector} from 'modules/items';
import {useReduxState} from 'lib/hooks';
import Item from './Item.Component';

export default props => {
  const finalProps = useReduxState(itemSelector, props);
  return useMemo(() => {
    console.log('outside render', finalProps.id);
    return <Item {...finalProps} />;
  }, [finalProps]);
};
