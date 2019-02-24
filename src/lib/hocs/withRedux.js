import React, {memo, useContext} from 'react';
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
    ? (...args) => mapObj(fromStateProps_, fn => fn(...args))
    : fromStateProps_;

  return BaseComponent => {
    const ImpBaseComponent = memo(BaseComponent);
    let actionProps;
    let prevState;
    let prevStateProps;
    let prevFinalProps;
    let prevResult;

    return props => {
      const {state, dispatch} = useContext(context);

      const stateProps =
        dependsOnProps || prevState !== state
          ? fromStateProps(state, props)
          : prevStateProps;

      actionProps =
        actionProps ||
        mapObj(fromActionProps || emptyObj, fn => (...args) =>
          dispatch(fn(...args))
        );

      const finalProps =
        prevFinalProps && shallowCompare(stateProps, prevStateProps)
          ? prevFinalProps
          : mapper
          ? mapper(stateProps, actionProps, props)
          : {...props, ...stateProps, ...actionProps};

      const result =
        prevFinalProps === finalProps ? (
          prevResult
        ) : (
          <ImpBaseComponent {...finalProps} />
        );

      prevState = state;
      prevStateProps = stateProps;
      prevFinalProps = finalProps;
      prevResult = result;

      return result;
    };
  };
};
