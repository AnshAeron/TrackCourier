import api from "../../services/api";

export interface BookingPayload {
  provider_id: string;
  consignment_a: string;
  consignment_b: string;
}

export async function getBookings() {
  const { data } = await api.get("/bookings");
  return data;
}

export async function createBooking(payload: BookingPayload) {
  const { data } = await api.post("/bookings", payload);
  return data;
}

export async function updateBooking(id: string, payload: BookingPayload) {
  const { data } = await api.put(`/bookings/${id}`, payload);
  return data;
}

export async function deleteBooking(id: string) {
  const { data } = await api.delete(`/bookings/${id}`);
  return data;
}

export async function getProviders() {
  const { data } = await api.get("/providers");
  return data;
}
