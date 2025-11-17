import * as yup from 'yup';

export const enrollmentValidationSchema = yup.object().shape({
  student: yup.object().required('form:error-student-required'),
  course: yup.object().required('form:error-course-required'),
});
