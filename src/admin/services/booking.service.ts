import api from "../../services/api";

export interface BookingPayload {
  provider_id: string;
  consignment_a: string;
  consignment_b: string;
}


export async function getBookings(
  limit = 50,
  offset = 0,
  filters = {
    tracking: "",
    provider: "",
    awb: "",
    from: "",
    to: "",
  },
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    tracking: filters.tracking,
    provider: filters.provider,
    awb: filters.awb,
    from: filters.from,
    to: filters.to,
  });

  const { data } = await api.get(`/bookings?${params.toString()}`);

  return data;
}
export async function createBooking(payload: BookingPayload) {
  const { data } = await api.post("/bookings/create", payload);
  return data;
}

export async function updateBooking(id: string, payload: BookingPayload) {
  const { data } = await api.put("/bookings/update", {
    id,
    ...payload,
  });
  return data;
}

export async function deleteBooking(id: string) {
  const { data } = await api.delete("/bookings/delete", {
    data: { id },
  });
  return data;
}

export async function getProviders() {
  const { data } = await api.get("/providers");
  return data;
}
