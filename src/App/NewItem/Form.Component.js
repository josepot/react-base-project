import React from 'react';
import {Form} from 'formik';
import {Loader, FormField, Button} from 'components';

const AddItemForm = ({isSubmitting, ...rest}) => (
  <Form>
    <FormField name="title" {...rest} />
    <FormField name="author" {...rest} />
    <FormField name="price" type="number" {...rest} />
    <Button type="submit" disabled={isSubmitting}>
      Submit <Loader color="white" size={9} hidden={!isSubmitting} />
    </Button>
  </Form>
);

export default AddItemForm;
