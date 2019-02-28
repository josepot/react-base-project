import React, {memo, useContext, useMemo} from 'react';
import {context} from 'ReduxProvider';

const emptyObj = {};
const alwaysEmpty = () => emptyObj;

export default (fromStateProps_, fromActionProps = emptyObj, mapper) => {
  const dependsOnProps = fromStateProps_ && fromStateProps_.length !== 1;
  const fromStateProps = !fromStateProps_ ? alwaysEmpty : fromStateProps_;

  return BaseComponent => {
    const MBaseComponent = memo(BaseComponent);

    return props => {
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

      return useMemo(() => {
        const finalProps = mapper
          ? mapper(stateProps, actionProps, props)
          : {...props, ...stateProps, ...actionProps};
        return <MBaseComponent {...finalProps} />;
      }, [actionProps, props, stateProps]);
    };
  };
};
