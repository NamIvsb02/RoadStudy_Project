import axiosClient from './axiosClient';

export const categoryApi = {
  getPublicList: (params) => axiosClient.get('/category', { params }),
};