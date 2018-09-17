import React from 'react';
import styled from 'react-emotion';
import {Field as UnstyledField} from 'formik';
import Input from './Input';

const Field = Input.withComponent(UnstyledField);

const FieldWrapper = styled('div')`
  margin: 10px 0;
`;

const ErrorMessage = styled('span')`
  display: inline-block;
  color: red;
`;

// eslint-disable-next-line react/prop-types
const FormField = ({name, type = 'string', errors, touched}) => (
  <FieldWrapper>
    <Field type={type} name={name} placeholder={name} />
    {errors[name] && touched[name] ? (
      <ErrorMessage>{errors[name]}</ErrorMessage>
    ) : null}
  </FieldWrapper>
);

FormField.displayName = 'FormField';
export default FormField;
