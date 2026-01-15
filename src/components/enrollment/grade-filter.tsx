import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { ActionMeta } from 'react-select';

type Props = {
  onGradeFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

export default function GradeFilter({ onGradeFilter, className }: Props) {
  const { t } = useTranslation();

  const gradeOptions = [
    {
      label: 'Grade 6',
      value: '1',
    },
    {
      label: 'Grade 7',
      value: '2',
    },
    {
      label: 'Grade 8',
      value: '3',
    },
    {
      label: 'Grade 9',
      value: '4',
    },
    {
      label: 'Grade 10',
      value: '5',
    },
    {
      label: 'Grade 11',
      value: '6',
    },
  ];

  return (
    <div className={cn('flex w-full', className)}>
      <div className="w-full">
        <Select
          options={gradeOptions}
          placeholder={t('common:filter-by-grade-placeholder')}
          onChange={onGradeFilter}
          isClearable={true}
        />
      </div>
    </div>
  );
}
