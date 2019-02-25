import React, {useContext, useMemo} from 'react';
import {context} from 'ReduxProvider';

const emptyObj = {};
const mapObj = (obj, mapper) =>
  Object.keys(obj).reduce((res, key) => {
    res[key] = mapper(obj[key], key, obj);
    return res;
  }, {});

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

const memoizeObjectFn = fn => {
  let prevResult;
  return (...args) => {
    const res = fn(...args);
    if (prevResult && shallowCompare(prevResult, res)) return prevResult;
    prevResult = res;
    return res;
  };
};

export default (fromStateProps_, fromActionProps, mapper) => {
  const isObject = typeof fromStateProps_ === 'object';
  const dependsOnProps =
    fromStateProps_ &&
    (isObject ? Object.values(fromStateProps_) : [fromStateProps_]).some(
      fn => fn.length !== 1
    );

  const fromStateProps = !fromStateProps_
    ? () => emptyObj
    : isObject
    ? memoizeObjectFn((...args) => mapObj(fromStateProps_, fn => fn(...args)))
    : fromStateProps_;

  return BaseComponent => {
    const baseFn = BaseComponent.prototype
      ? p => <BaseComponent {...p} /> // eslint-disable-line
      : BaseComponent;
    let actionProps = fromActionProps ? null : emptyObj;

    return props => {
      const {state, dispatch} = useContext(context);
      const dependantProps = dependsOnProps ? props : emptyObj;
      const stateProps = useMemo(() => fromStateProps(state, dependantProps), [
        state,
        dependantProps,
      ]);

      if (!actionProps) {
        actionProps = mapObj(fromActionProps, fn => (...args) =>
          dispatch(fn(...args))
        );
      }

      return useMemo(
        () =>
          baseFn(
            mapper
              ? mapper(stateProps, actionProps, props)
              : {...props, ...stateProps, ...actionProps}
          ),
        [stateProps] // eslint-disable-line
      );
    };
  };
};
