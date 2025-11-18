import { Control, FieldErrors, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { Course, Enrollment, Student } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { useCoursesQuery } from '@/data/course';
import Label from '../ui/label';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { animateScroll } from 'react-scroll';
import {
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
} from '@/data/enrollment';
import { useStudentsQuery } from '@/data/student';
import { useCreateEnrollmentPaymentMutation } from '@/data/enrollment-payment';
import { enrollmentPaymentValidationSchema } from './enrollment-payment-validation-schema';
import { monthOptions } from '@/constants';

function SelectCourse({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { courses, loading } = useCoursesQuery({ language: locale });
  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-courses')}
        name="course"
        control={control}
        getOptionLabel={(option: any) => `${option.name} - Rs. ${option.fee}`}
        getOptionValue={(option: any) => option.slug}
        options={courses!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.course?.message)} />
    </div>
  );
}

function SelectStudent({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { students, paginatorInfo, loading, error } = useStudentsQuery({
    limit: 20,
  });
  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-student')}
        name="student"
        control={control}
        getOptionLabel={(option: any) =>
          `${option.user.first_name} ${option.user.last_name}`
        }
        getOptionValue={(option: any) => option.id}
        options={students!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.student?.message)} />
    </div>
  );
}

type FormValues = {
  student: Student;
  course: Course;
  month: { label: string; value: number };
};

const defaultValues = {
  // student: '',
  // course: '',
};

type IProps = {
  initialValues?: Enrollment | undefined;
};
export default function CreateOrUpdateEnrollmentPaymentForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
        ...initialValues,
        ...(isNewTranslation && {
          type: null,
        }),
      }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(enrollmentPaymentValidationSchema),
  });

  const { mutate: createEnrollmentPayment, isLoading: creating } =
    useCreateEnrollmentPaymentMutation();
  const { mutate: updateEnrollment, isLoading: updating } =
    useUpdateEnrollmentMutation();

  const onSubmit = async (values: FormValues) => {
    const currentYear = new Date().getFullYear();

    const input = {
      student: values.student.id,
      course: values.course.id,
      amount: values.course.fee,
      payment_month: values.month.value,
      payment_year: currentYear,
    };
    if (!initialValues) {
      createEnrollmentPayment(
        {
          ...input,
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: 'manual',
                message: error?.response?.data[field],
              });
            });
            animateScroll.scrollToTop();
          },
        },
      );
    } else {
      updateEnrollment(
        {
          ...input,
          id: initialValues.id!,
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: 'manual',
                message: error?.response?.data[field],
              });
            });
            animateScroll.scrollToTop();
          },
        },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
            } ${t('form:category-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <SelectStudent control={control} errors={errors} />
          <SelectCourse control={control} errors={errors} />
          <div className="mb-5">
            <SelectInput
              label="Payment Month"
              name="month"
              control={control}
              options={monthOptions}
              required
            />
            <ValidationError message={t(errors.month?.message)} />
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="text-sm me-4 md:text-base"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update-enrollment-payment')
              : t('form:button-label-add-enrollment-payment')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
