import {useContext, useEffect, useMemo, useRef} from 'react';
import {context} from 'ReduxProvider';

const emptyObj = {};
const noUsage = [Function.prototype, Function.prototype];

export default (selector, props = emptyObj) => {
  const ref = useRef(selector.use ? selector.use() : noUsage, [selector]);
  useEffect(() => ref.current[1], [selector]);
  const {state} = useContext(context);
  return useMemo(() => {
    const result = selector(state, props);
    ref.current[0]();
    return result;
  }, [selector, state, props]);
};
