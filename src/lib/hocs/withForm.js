import {always, assoc, assocPath, map} from 'ramda';
import React, {useState} from 'react';

const resetState = (props, mapPropsToValues) => ({
  values: mapPropsToValues(props),
  errors: {},
  touched: {},
  isSubmitting: false,
});

export default ({
  mapPropsToValues,
  validate,
  handleSubmit,
}) => BaseComponent => props => {
  const [state, setState] = useState(resetState(props, mapPropsToValues));

  const onBlur = e => {
    const {name} = e.target;
    const {touched} = state;
    if (touched[name]) return;
    setState(assocPath(['touched', name], true));
  };

  const onChange = e => {
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
  };

  const reset = () => {
    setState(resetState(props, mapPropsToValues));
  };

  const onSubmit = e => {
    e.preventDefault();

    const {values} = state;
    const errors = validate(values);
    const touched = map(always(true), values);
    const hasErrors = Object.keys(errors).length > 0;

    setState(prev => ({...prev, errors, touched, isSubmitting: !hasErrors}));
    if (hasErrors) return;
    handleSubmit(values, {
      props,
      resetForm: reset,
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <BaseComponent {...state} onChange={onChange} onBlur={onBlur} />
    </form>
  );
};
