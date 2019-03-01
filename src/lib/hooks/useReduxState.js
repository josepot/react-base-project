import {useContext, useEffect, useMemo, useRef} from 'react';
import {context} from 'ReduxProvider';

const emptyObj = {};
const alwaysEmptyArray = () => [];

export default (selector, props = emptyObj) => {
  const ref = useRef(selector.use ? selector.use() : alwaysEmptyArray);
  const {state} = useContext(context);
  const fns = useMemo(() => ref.current(state, props), [state, props]);
  fns.forEach(fn => {
    useEffect(() => fn(), [fn]); // eslint-disable-line
  });
  return useMemo(() => selector(state, props), [state, props, selector]);
};
