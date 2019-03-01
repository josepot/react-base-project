import {always, assoc, assocPath, map} from 'ramda';
import React, {useCallback, useEffect, useState} from 'react';

const resetState = (props, mapPropsToValues) => ({
  values: mapPropsToValues(props),
  errors: {},
  touched: {},
  isSubmitting: false,
  isSubmitPending: false,
});

export default ({
  mapPropsToValues,
  validate,
  handleSubmit,
}) => BaseComponent => props => {
  const [state, setState] = useState(() => resetState(props, mapPropsToValues));

  const onBlur = useCallback(
    e => {
      const {name} = e.target;
      setState(prevState =>
        prevState.touched[name]
          ? prevState
          : assocPath(['touched', name], true, prevState)
      );
    },
    [setState]
  );

  const onChange = useCallback(
    e => {
      const {name, value} = e.target;
      setState(({values, ...rest}) => {
        const nextValues = assoc(name, value, values);
        const nextErrors = validate(nextValues);
        return {
          ...rest,
          values: nextValues,
          errors: nextErrors,
        };
      });
    },
    [setState]
  );

  const onFormSubmit = useCallback(
    e => {
      e.preventDefault();

      setState(({isSubmitting, values}) => {
        const errors = validate(values);
        const touched = map(always(true), values);
        const isSubmitPending = Object.keys(errors).length === 0;
        return {values, errors, touched, isSubmitPending, isSubmitting};
      });
    },
    [setState]
  );

  const onSubmit = useCallback(
    values =>
      handleSubmit(values, {
        props,
        resetForm: () => setState(resetState(props, mapPropsToValues)),
      }),
    [setState, props]
  );

  useEffect(() => {
    if (!state.isSubmitPending) return;
    onSubmit(state.values);
    setState(prevState => ({
      ...prevState,
      isSubmitting: true,
      isSubmitPending: false,
    }));
  }, [state.isSubmitPending, state.values, onSubmit]);

  return (
    <form onSubmit={onFormSubmit}>
      <BaseComponent {...state} onChange={onChange} onBlur={onBlur} />
    </form>
  );
};
