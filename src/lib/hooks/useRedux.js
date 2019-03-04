import {useEffect, useRef, useMemo} from 'react';
import {useReduxState, useReduxActions} from './index';

const shallowCompare = (a, b) => {
  if (a === b) return true;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (let i = 0; i < aKeys.length; i += 1) {
    if (a[aKeys[i]] !== b[aKeys[i]] || a[bKeys[i]] !== b[bKeys[i]]) {
      return false;
    }
  }
  return true;
};

export default (selector, actionCreators, mapper, props) => {
  const prevPropsRef = useRef(null);
  const stateProps = useReduxState(selector, props);
  const actionProps = useReduxActions(actionCreators);

  const result = useMemo(() => {
    const allProps = mapper(stateProps, actionProps, props);
    const isTheSame =
      prevPropsRef.current && shallowCompare(allProps, prevPropsRef.current);
    return isTheSame ? prevPropsRef.current : allProps;
  }, [stateProps, actionProps, props, mapper]);

  useEffect(() => {
    prevPropsRef.current = result;
  }, [result]);

  return result;
};
