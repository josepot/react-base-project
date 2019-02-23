import React, {useContext} from 'react';
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
      ? function() {
          return mapObj(fromStateProps_, fn => fn(...arguments));
        }
      : fromStateProps_;

  return BaseComponent => {
    let prevState;
    let prevStateProps;
    let prevProps;
    let prevResult;
    let newProps;
    let actionProps;

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

      newProps =
        props === prevProps && stateProps === prevStateProps
          ? newProps
          : mapper
            ? mapper(stateProps, actionProps, props)
            : {...props, ...stateProps, ...actionProps};

      const result =
        !prevProps || !shallowCompare(newProps, prevProps) ? (
          <BaseComponent {...newProps} />
        ) : (
          prevResult
        );

      prevState = state;
      prevStateProps = stateProps;
      prevProps = props;
      prevResult = result;

      return result;
    };
  };
};
