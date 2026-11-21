import axiosClient from "./axiosClient";

export const recommendationApi = {
  getMine: () => axiosClient.get("/recommendation/me"),
};
