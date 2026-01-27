import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import * as categoriesIcon from '@/components/icons/category';
import {
  Course,
  CourseOffering,
  GradeLevel,
  SortOrder,
  Teacher,
} from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { MappedPaginatorInfo } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { NoDataFound } from '@/components/icons/no-data-found';
import { siteSettings } from '@/settings/site.settings';

export type IProps = {
  courseOfferings: CourseOffering[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CourseOfferingList = ({
  courseOfferings,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    // {
    //   title: t('table:table-item-id'),
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: alignLeft,
    //   width: 120,
    //   render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    // },
    {
      title: t('table:table-item-course'),
      dataIndex: 'course',
      key: 'course',
      align: alignLeft,
      width: 120,
      render: (course: Course) => (
        <div
          className="overflow-hidden truncate whitespace-nowrap"
          title={course?.name}
        >
          {course?.name}
        </div>
      ),
    },
    {
      title: t('table:table-item-grade'),
      dataIndex: 'grade_level',
      key: 'grade_level',
      align: alignLeft,
      width: 120,
      render: (grade_level: GradeLevel) => (
        <div
          className="overflow-hidden truncate whitespace-nowrap"
          title={grade_level?.name}
        >
          {grade_level?.name}
        </div>
      ),
    },
    {
      title: t('table:table-item-teacher'),
      dataIndex: 'teacher',
      key: 'teacher',
      align: alignLeft,
      width: 150,
      render: (teacher: Teacher) => (
        <div
          className="overflow-hidden truncate whitespace-nowrap"
          title={teacher?.user?.first_name}
        >
          {teacher?.user?.first_name}
        </div>
      ),
    },
    {
      title: t('table:table-item-year'),
      dataIndex: 'year',
      key: 'year',
      align: alignLeft,
      width: 120,
    },
    {
      title: t('table:table-item-batch'),
      dataIndex: 'batch',
      key: 'batch',
      align: alignLeft,
      width: 120,
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: (id: string, record: CourseOffering) => (
        <LanguageSwitcher
          slug={id}
          record={record}
          deleteModalView="DELETE_COURSE"
          deleteBySlug={record.id}
          routes={Routes?.courseOffering}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={courseOfferings}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default CourseOfferingList;
