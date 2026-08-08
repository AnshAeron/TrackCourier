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

  sender_name: string;
  sender_phone: string;
  recipient_name: string;
  recipient_phone: string;

  booking_date: string;
  contents: string;
  pieces: string;
  weight: string;

  origin_country: string;
  destination_country: string;
  created_at: string;
}

export default function Bookings() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [form, setForm] = useState({
    provider_id: "",
    consignment_a: "",
    consignment_b: "",
    sender_name: "",
    sender_phone: "",
    recipient_name: "",
    recipient_phone: "",
    booking_date: "",
    contents: "",
    pieces: "",
    weight: "",
    origin_country: "",
    destination_country: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const LIMIT = 50;

  const [offset, setOffset] = useState(0);

  const [, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    tracking: "",
    provider: "",
    awb: "",
    from: "",
    to: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function loadData() {
    try {
      const providerRes = await getProviders();
      const bookingRes = await getBookings(LIMIT, 0, filters);

      setProviders(providerRes.providers);
      setBookings(bookingRes.bookings);
      setOffset(0);

      setHasMore(true);
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
      sender_name: booking.sender_name || "",
      sender_phone: booking.sender_phone || "",
      recipient_name: booking.recipient_name || "",
      recipient_phone: booking.recipient_phone || "",
      booking_date: booking.booking_date
        ? booking.booking_date.substring(0, 10)
        : "",
      contents: booking.contents || "",
      pieces: booking.pieces?.toString() || "",
      weight: booking.weight?.toString() || "",
      origin_country: booking.origin_country || "",
      destination_country: booking.destination_country || "",
    });
  }
  async function loadMore() {
    const nextOffset = offset + LIMIT;

    try {
      const bookingRes = await getBookings(LIMIT, nextOffset, filters);

      const newBookings = bookingRes.bookings;

      // Agar koi nayi booking nahi aayi
      if (newBookings.length === 0) {
        alert("No more bookings available.");
        return;
      }

      // Sirf wahi bookings add karo jo pehle se list me nahi hain
      const uniqueBookings = newBookings.filter(
        (booking: Booking) => !bookings.some((b) => b.id === booking.id),
      );

      // Agar saari bookings duplicate nikli
      if (uniqueBookings.length === 0) {
        alert("No more bookings available.");
        return;
      }

      setBookings((prev) => [...prev, ...uniqueBookings]);
      setOffset(nextOffset);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    // Mandatory field validation
    if (!form.consignment_a.trim()) {
      setError("Tracking ID is required.");
      return;
    }

    if (!form.provider_id) {
      setError("Courier Provider is required.");
      return;
    }

    if (!form.consignment_b.trim()) {
      setError("Provider's AWB/Tracking ID is required.");
      return;
    }

    setLoading(true);

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
        sender_name: "",
        sender_phone: "",
        recipient_name: "",
        recipient_phone: "",
        booking_date: "",
        contents: "",
        pieces: "",
        weight: "",
        origin_country: "",
        destination_country: "",
      });

      setEditingId(null);
      setError("");

      loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
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
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}
        <div>
          <label className="block mb-2 font-medium">
            Tracking ID<span className="text-red-500">*</span>
          </label>

          <input
            className="w-full border rounded p-2"
            placeholder="Enter Tracking ID"
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
          <label className="block mb-2 font-medium">
            Courier Provider<span className="text-red-500">*</span>
          </label>

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

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Provider's AWB/Tracking ID
            <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded p-2"
            placeholder="Enter Provider's AWB/Tracking ID"
            value={form.consignment_b}
            onChange={(e) =>
              setForm({
                ...form,
                consignment_b: e.target.value,
              })
            }
          />
        </div>

        <div className="pt-8">
          <h2 className="text-xl font font-semibold mb-4">
            Other Shipment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Sender Name</label>
              <input
                className="w-full border rounded p-2"
                value={form.sender_name}
                onChange={(e) =>
                  setForm({ ...form, sender_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Sender Phone</label>
              <input
                type="tel"
                className="w-full border rounded p-2"
                value={form.sender_phone}
                onChange={(e) =>
                  setForm({ ...form, sender_phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Recipient Name</label>
            <input
              className="w-full border rounded p-2"
              value={form.recipient_name}
              onChange={(e) =>
                setForm({ ...form, recipient_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Recipient Phone</label>
            <input
              type="tel"
              className="w-full border rounded p-2"
              value={form.recipient_phone}
              onChange={(e) =>
                setForm({ ...form, recipient_phone: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Booking Date</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={form.booking_date}
              onChange={(e) =>
                setForm({ ...form, booking_date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Contents</label>
            <input
              className="w-full border rounded p-2"
              value={form.contents}
              onChange={(e) => setForm({ ...form, contents: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Pieces</label>
              <input
                type="number"
                min="1"
                className="w-full border rounded p-2"
                value={form.pieces}
                onChange={(e) => setForm({ ...form, pieces: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium">Weight</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded p-2"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Origin Country</label>
            <input
              className="w-full border rounded p-2"
              value={form.origin_country}
              onChange={(e) =>
                setForm({ ...form, origin_country: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Destination Country
            </label>
            <input
              className="w-full border rounded p-2"
              value={form.destination_country}
              onChange={(e) =>
                setForm({ ...form, destination_country: e.target.value })
              }
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading
            ? "Loading..."
            : editingId
              ? "Update Booking"
              : "Create Booking"}
        </button>
      </form>
      <div className="border rounded-lg p-4 mb-6 bg-white">
        <h2 className="text-lg font-semibold mb-4">Search Bookings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Tracking ID"
            className="border rounded p-2"
            value={filters.tracking}
            onChange={(e) =>
              setFilters({ ...filters, tracking: e.target.value })
            }
          />

          <select
            className="border rounded p-2"
            value={filters.provider}
            onChange={(e) =>
              setFilters({ ...filters, provider: e.target.value })
            }
          >
            <option value="">All Providers</option>

            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Provider AWB"
            className="border rounded p-2"
            value={filters.awb}
            onChange={(e) => setFilters({ ...filters, awb: e.target.value })}
          />

          <input
            type="date"
            className="border rounded p-2"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />

          <input
            type="date"
            className="border rounded p-2"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>

          <button
            onClick={() => {
              setFilters({
                tracking: "",
                provider: "",
                awb: "",
                from: "",
                to: "",
              });

              setTimeout(() => loadData(), 0);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Tracking ID</th>
            <th className="border p-3">Provider</th>
            <th className="border p-3">Provider's AWB/Tracking ID</th>
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
                <td className="border p-3">{booking.consignment_a}</td>
                <td className="border p-3">{booking.provider_name}</td>

                <td className="border p-3">{booking.consignment_b || "-"}</td>

                <td className="border p-3">
                  {new Date(booking.created_at).toLocaleString()}
                </td>
                <td className="border p-3">
                  {user.role === "ADMIN" && (
                    <button
                      onClick={() => handleEdit(booking)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {user.role === "ADMIN" && (
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="ml-4 text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mt-6 flex justify-center">
        <button
          onClick={loadMore}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Load More
        </button>
      </div>
    </div>
  );
}
