import api from "../../services/api";

export async function getDashboardStats() {
  const { data } = await api.get("/dashboard/stats");
  return data;
}
