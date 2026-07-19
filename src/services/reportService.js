import api from "../api/axios";

export const createReport = async (payload) => {
  const response = await api.post("/na/reports", payload);
  return response.data;
};

export const updateReport = async (reportId, payload) => {
  const response = await api.put(`/na/reports/${reportId}`, payload);
  return response.data;
};

export const getReports = async (date) => {
  const response = await api.get(`/na/reports?date=${date}`);
  return response.data.data;
};
