import {always} from 'ramda';
import {compose, withProps} from 'recompose';
import {connect} from 'react-redux';
import {withFormik} from 'formik';

import {onSubmit, onItemSubmitted} from 'modules/items';
import {createValidations} from 'utils';
import FormComponent from './Form.Component';

const isNotEmpty = x => !!x;
const isValidPrice = x => typeof x === 'number' && x > 0;

export default compose(
  withProps({onItemSubmitted}),
  connect(
    null,
    {onSubmit}
  ),
  withFormik({
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
      props.onItemSubmitted(() => {
        resetForm();
      });
    },
  })
)(FormComponent);
