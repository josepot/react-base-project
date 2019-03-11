import {useContext, useEffect, useMemo} from 'react';
import {context} from 'ReduxProvider';

const emptyObj = {};

export default (selector_, props = emptyObj) => {
  const [selector, unsubscribe] = useMemo(
    () => (selector_.use ? selector_.use() : [selector_, Function.prototype]),
    [selector_]
  );
  useEffect(() => unsubscribe, [unsubscribe]);
  const {state} = useContext(context);
  return useMemo(() => selector(state, props), [selector, state, props]);
};
