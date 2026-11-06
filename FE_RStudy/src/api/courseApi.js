import axiosClient from './axiosClient';

export const courseApi = {
  getPublicList: (params) => axiosClient.get('/course', { params }),
  getPublicById: (id) => axiosClient.get(`/course/${id}`),
};