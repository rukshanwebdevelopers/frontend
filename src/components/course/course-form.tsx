import Input from '@/components/ui/input';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { EditIcon } from '@/components/icons/edit';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { useState } from 'react';
import { Course, Subject, User } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSettingsQuery } from '@/data/settings';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { subjectValidationSchema } from './course-validation-schema';
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from '@/data/course';
import { useSubjectsQuery } from '@/data/subject';
import Label from '../ui/label';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { animateScroll } from 'react-scroll';
import { useTeachersQuery } from '@/data/teacher';

function SelectSubject({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { subjects, loading } = useSubjectsQuery({ language: locale });
  return (
    <div className="mb-5">
      <SelectInput
        name="subject"
        control={control}
        label={t('form:input-label-subjects')}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.slug}
        options={subjects!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.subject?.message)} />
    </div>
  );
}

function SelectTeacher({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { teachers, paginatorInfo, loading, error } = useTeachersQuery({
    limit: 20,
  });
  return (
    <div className="mb-5">
      <SelectInput
        name="teacher"
        control={control}
        label={t('form:input-label-teacher')}
        getOptionLabel={(option: any) =>
          `${option.user.first_name} ${option.user.last_name}`
        }
        getOptionValue={(option: any) => option.id}
        options={teachers!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.teacher?.message)} />
    </div>
  );
}

type FormValues = {
  name: string;
  slug: string;
  code: string;
  subject: Subject;
  teacher: User;
};

const defaultValues = {
  name: '',
  slug: '',
  code: '',
};

type IProps = {
  initialValues?: Course | undefined;
};
export default function CreateOrUpdateCourseForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);

  const isNewTranslation = router?.query?.action === 'translate';
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const {
    register,
    handleSubmit,
    watch,
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
    resolver: yupResolver(subjectValidationSchema),
  });

  const slugAutoSuggest = formatSlug(watch('name'));
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const { mutate: createCourse, isLoading: creating } =
    useCreateCourseMutation();
  const { mutate: updateCourse, isLoading: updating } =
    useUpdateCourseMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      slug: slugAutoSuggest,
      code: values.code,
      fee: 2500,
      subject: values.subject.id,
      teacher: values.teacher.id,
    };
    if (!initialValues) {
      createCourse(
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
      updateCourse(
        {
          ...input,
          id: initialValues.slug!,
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
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:category-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            required
          />

          {isSlugEditable ? (
            <div className="relative mb-5">
              <Input
                label={t('form:input-label-slug')}
                {...register('slug')}
                error={t(errors.slug?.message!)}
                variant="outline"
                disabled={isSlugDisable}
              />
              <button
                className="absolute top-[27px] right-px z-0 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                type="button"
                title={t('common:text-edit')}
                onClick={() => setIsSlugDisable(false)}
              >
                <EditIcon width={14} />
              </button>
            </div>
          ) : (
            <Input
              label={t('form:input-label-slug')}
              {...register('slug')}
              error={t(errors.slug?.message!)}
              value={slugAutoSuggest}
              variant="outline"
              className="mb-5"
              disabled
            />
          )}

          <Input
            label={t('form:input-label-code')}
            {...register('code')}
            error={t(errors.code?.message!)}
            variant="outline"
            className="mb-5"
            required
          />

          <SelectSubject control={control} errors={errors} />
          <SelectTeacher control={control} errors={errors} />
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
              ? t('form:button-label-update-course')
              : t('form:button-label-add-course')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
