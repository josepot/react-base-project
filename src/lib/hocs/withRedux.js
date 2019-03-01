import React, {useContext, useMemo} from 'react';
import {context} from 'ReduxProvider';

const emptyObj = {};
const alwaysEmpty = () => emptyObj;
const defaultMapper = (stateProps, actionProps, externalProps) => ({
  ...externalProps,
  ...stateProps,
  ...actionProps,
});

export default (
  fromStateProps_,
  fromActionProps = emptyObj,
  mapper = defaultMapper
) => {
  const dependsOnProps = fromStateProps_ && fromStateProps_.length !== 1;
  const fromStateProps = !fromStateProps_ ? alwaysEmpty : fromStateProps_;

  return BaseComponent => props => {
    const dependantProps = dependsOnProps ? props : emptyObj;

    const {state, dispatch} = useContext(context);
    const stateProps = useMemo(() => fromStateProps(state, dependantProps), [
      state,
      dependantProps,
    ]);
    const actionProps = useMemo(() => {
      const res = {};
      Object.entries(fromActionProps).forEach(([name, aCreator]) => {
        res[name] = (...args) => dispatch(aCreator(...args));
      });
      return res;
    }, [dispatch]);

    return useMemo(
      () => <BaseComponent {...mapper(stateProps, actionProps, props)} />,
      [actionProps, props, stateProps]
    );
  };
};
