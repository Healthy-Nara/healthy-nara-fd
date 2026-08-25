import api from "../api/axios";

export const getDutySession = async () => {
  const response = await api.get("/bookings?status=Assigned&excludeStatuses=Completed,Cancelled");
  return response.data.data;
};

export const startDuty = async (bookingId) => {
  const response = await api.post("/na/duty/start", { bookingId });
  return response.data;
};

export const getDutyStatus = async () => {
  const response = await api.get("/na/duty/status");
  return response.data.data;
};

export const finishDuty = async (dutyLogId) => {
  const response = await api.post("/na/duty/finish", { dutyLogId });
  return response.data;
};

export const getDutyLogs = async (date, bookingId) => {
  let url = "/na/duty/logs";
  const params = [];
  if (date) params.push(`date=${date}`);
  if (bookingId) params.push(`bookingId=${bookingId}`);
  if (params.length > 0) url += `?${params.join("&")}`;
  const response = await api.get(url);
  return response.data.data;
};
