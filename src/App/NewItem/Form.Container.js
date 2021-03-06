import {always, both, complement, compose, lt} from 'ramda';
import {connect} from 'react-redux-lean';

import {withForm} from 'hocs';

import {onSubmit, onItemSubmitted} from 'modules/items';
import {createValidations} from 'utils';
import FormComponent from './Form.Component';

const isNotEmpty = Boolean;
const isValidPrice = compose(
  both(complement(Number.isNaN), lt(0)),
  parseFloat
);

export default compose(
  connect(
    null,
    {onSubmit},
    (state, actions) => actions
  ),
  withForm({
    mapPropsToValues: always({
      title: '',
      author: '',
      price: '',
    }),
    validate: createValidations({
      title: [isNotEmpty, `Title can't be blank`],
      author: [isNotEmpty, `Please enter the author's name`],
      price: [isValidPrice, 'Please enter a valid price'],
    }),
    handleSubmit(values, {props, resetForm}) {
      props.onSubmit(values);
      onItemSubmitted(resetForm);
    },
  })
)(FormComponent);
