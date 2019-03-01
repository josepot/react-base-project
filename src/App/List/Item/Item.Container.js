import React, {useMemo} from 'react';
import {itemSelector} from 'modules/items';
import {push} from 'modules/router';
import {useReduxActions, useReduxState} from 'lib/hooks';
import Item from './Item.Component';

const actions = {push};
export default props => {
  const actionProps = useReduxActions(actions);
  const stateProps = useReduxState(itemSelector, props);
  return useMemo(() => {
    console.log('outside render', stateProps.id);
    const finalProps = {...stateProps, ...actionProps};
    return <Item {...finalProps} />;
  }, [stateProps, actionProps]);
};
