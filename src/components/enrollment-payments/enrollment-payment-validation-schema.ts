import * as yup from 'yup';

export const enrollmentPaymentValidationSchema = yup.object().shape({
  student: yup.object().required('form:error-student-required'),
  course: yup.object().required('form:error-course-required'),
  payment_month: yup.object().required('form:error-month-required'),
});
