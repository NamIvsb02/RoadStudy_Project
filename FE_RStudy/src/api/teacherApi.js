import axiosClient from './axiosClient';

export const teacherApi = {
  getPublicList: (params) => axiosClient.get('/teacher', { params }),
  getPublicById: (id) => axiosClient.get(`/teacher/${id}`),
};