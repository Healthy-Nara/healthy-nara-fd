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
