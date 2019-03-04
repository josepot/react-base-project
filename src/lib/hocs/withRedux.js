import React, {useMemo} from 'react';
import {useRedux} from 'hooks';

const emptyObj = {};
const alwaysEmpty = () => emptyObj;
const defaultMapper = (stateProps, actionProps, externalProps) => ({
  ...externalProps,
  ...stateProps,
  ...actionProps,
});

export default (fromStateProps_, fromActionProps_, mapper = defaultMapper) => {
  const fromStateProps = fromStateProps_ || alwaysEmpty;
  const fromActionProps = fromActionProps_ || emptyObj;
  const dependsOnProps =
    fromStateProps === alwaysEmpty || fromStateProps.length !== 1;

  return BaseComponent => props => {
    const dependantProps = dependsOnProps ? props : emptyObj;
    const finalProps = useRedux(
      fromStateProps,
      fromActionProps,
      mapper,
      dependantProps
    );

    return useMemo(() => <BaseComponent {...finalProps} />, [finalProps]);
  };
};
