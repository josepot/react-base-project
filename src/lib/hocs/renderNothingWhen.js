import React from 'react';

export default conditionFn => Component =>
  function renderNothngWhen(props) {
    return conditionFn(props) ? null : <Component {...props} />;
  };
