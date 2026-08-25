import api from "../api/axios";

export const createReport = async (payload) => {
  const response = await api.post("/na/reports", payload);
  return response.data;
};

export const updateReport = async (reportId, payload) => {
  const response = await api.put(`/na/reports/${reportId}`, payload);
  return response.data;
};

export const getReports = async (date, bookingId) => {
  let url = `/na/reports?date=${date}`;
  if (bookingId) {
    url += `&bookingId=${bookingId}`;
  }
  const response = await api.get(url);
  return response.data.data;
};

export const getAllReports = async (bookingId) => {
  let url = `/na/reports`;
  if (bookingId) {
    url += `?bookingId=${bookingId}`;
  }
  const response = await api.get(url);
  return response.data.data;
};
