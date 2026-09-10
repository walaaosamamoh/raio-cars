import * as yup from 'yup';

// This schema defines the validation rules for the sign-in form.
export const signInSchema = yup.object({

  // Rule for the 'phone' field
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^\d{7,10}$/, 'Please enter a valid phone number (7-10 digits)'),

});
