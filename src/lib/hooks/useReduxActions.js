import {useContext, useMemo} from 'react';
import {context} from 'ReduxProvider';

const emptyObj = {};

export default (actionCreators = emptyObj) => {
  const {dispatch} = useContext(context);
  return useMemo(() => {
    const res = {};
    Object.entries(actionCreators).forEach(([name, aCreator]) => {
      res[name] = (...args) => dispatch(aCreator(...args));
    });
    return res;
  }, [actionCreators, dispatch]);
};
