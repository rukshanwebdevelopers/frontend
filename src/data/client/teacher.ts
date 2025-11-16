import {
  CreateTeacherInput,
  QueryOptions,
  Teacher,
  TeacherPaginator,
  TeacherQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const teacherClient = {
  ...crudFactory<Teacher, QueryOptions, CreateTeacherInput>(
    API_ENDPOINTS.TEACHERS
  ),
  paginated: ({ name, ...params }: Partial<TeacherQueryOptions>) => {
    return HttpClient.get<TeacherPaginator>(API_ENDPOINTS.TEACHERS, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
