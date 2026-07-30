import { useEffect, useState } from "react";

import {
  createBooking,
  getBookings,
  getProviders,
  updateBooking,
  deleteBooking,
} from "../services/booking.service";

interface Provider {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  provider_name: string;
  provider_id: string;
  consignment_a: string;
  consignment_b: string;
  created_at: string;
}

export default function Bookings() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [form, setForm] = useState({
    provider_id: "",
    consignment_a: "",
    consignment_b: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadData() {
    try {
      const providerRes = await getProviders();
      const bookingRes = await getBookings();

      setProviders(providerRes.providers);
      setBookings(bookingRes.bookings);
      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  }
  function handleEdit(booking: Booking) {
    setEditingId(booking.id);

    setForm({
      provider_id: booking.provider_id,
      consignment_a: booking.consignment_a,
      consignment_b: booking.consignment_b || "",
    });
  }
  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (editingId) {
        await updateBooking(editingId, form);
      } else {
        await createBooking(form);
      }

      alert(
        editingId
          ? "Booking Updated Successfully"
          : "Booking Created Successfully",
      );

      setForm({
        provider_id: "",
        consignment_a: "",
        consignment_b: "",
      });

      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }
  async function handleDelete(id: string) {
    if (!window.confirm("Delete this booking?")) return;

    try {
      const res = await deleteBooking(id);

      if (res.success) {
        alert("Booking deleted successfully.");
        loadData();
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-6 space-y-4 mb-8"
      >
        <div>
          <label className="block mb-2 font-medium">Courier Provider</label>

          <select
            className="w-full border rounded p-2"
            value={form.provider_id}
            onChange={(e) =>
              setForm({
                ...form,
                provider_id: e.target.value,
              })
            }
            required
          >
            <option value="">Select Provider</option>

            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Consignment A</label>

          <input
            className="w-full border rounded p-2"
            placeholder="Enter Consignment A"
            value={form.consignment_a}
            onChange={(e) =>
              setForm({
                ...form,
                consignment_a: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Consignment B</label>

          <input
            className="w-full border rounded p-2"
            placeholder="Enter Consignment B"
            value={form.consignment_b}
            onChange={(e) =>
              setForm({
                ...form,
                consignment_b: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Booking" : "Create Booking"}
        </button>
      </form>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Provider</th>
            <th className="border p-3">Consignment A</th>
            <th className="border p-3">Consignment B</th>
            <th className="border p-3">Created At</th>
            <th className="border p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={5} className="border p-4 text-center text-gray-500">
                No bookings found.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border p-3">{booking.provider_name}</td>

                <td className="border p-3">{booking.consignment_a}</td>

                <td className="border p-3">{booking.consignment_b || "-"}</td>

                <td className="border p-3">
                  {new Date(booking.created_at).toLocaleString()}
                </td>
                <td className="border p-3">
                  <button
                    onClick={() => handleEdit(booking)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
