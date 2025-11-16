import * as yup from 'yup';

export const subjectValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  code: yup.string().required('form:error-code-required'),
  subject: yup.object().required('form:error-subject-required'),
  teacher: yup.object().required('form:error-teacher-required'),
});
