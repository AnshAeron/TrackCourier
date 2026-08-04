import { useEffect, useState } from "react";
import {
  createProvider,
  getProviders,
  updateProvider,
  deleteProvider,
} from "../services/provider.service";

interface Provider {
  id: string;
  name: string;
  logo_url: string;
  tracking_base_url: string;
}

export default function Providers() {
  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    tracking_base_url: "",
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loadProviders = async () => {
    try {
      const res = await getProviders();

      if (res.success) {
        setProviders(res.providers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (provider: Provider) => {
    setEditingId(provider.id);

    setForm({
      name: provider.name,
      logo_url: provider.logo_url,
      tracking_base_url: provider.tracking_base_url,
    });
  };
const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this provider?",
  );

  if (!confirmDelete) return;

  try {
    const res = await deleteProvider(id);

    if (res.success) {
      await loadProviders();
      alert("Provider deleted successfully.");
    }
  } catch (err) {
    console.error(err);
    alert("Delete failed.");
  }
};

  useEffect(() => {
    loadProviders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting form:", form);

    setLoading(true);

    try {
      const res = editingId
        ? await updateProvider(editingId, form)
        : await createProvider(form);
      console.log("Create response:", res);

      if (!res.success) {
        alert(res.message);
        return;
      }

      alert(
        editingId
          ? "Provider Updated Successfully ✅"
          : "Provider Added Successfully ✅",
      );

      setForm({
        name: "",
        logo_url: "",
        tracking_base_url: "",
      });

      try {
        await loadProviders();
      } catch (err) {
        console.error("loadProviders failed:", err);
      }
    }  catch (err) {
  console.error("createProvider failed:", err);
  alert("Server Error");
} finally {
  setLoading(false);
}
  };
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courier Providers</h1>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Provider Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Blue Dart"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Logo URL</label>

            <input
              type="text"
              name="logo_url"
              value={form.logo_url}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="https://logo.com/logo.png"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Tracking Base URL
            </label>

            <input
              type="text"
              name="tracking_base_url"
              value={form.tracking_base_url}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="https://www.bluedart.com/tracking?awb=[TRACKING_NO]"
              required
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Loading..."
                : editingId
                  ? "Update Provider"
                  : "Save Provider"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 text-xl font-semibold">Providers List</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">Name</th>
              <th className="text-left">Tracking Base URL</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {providers.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-500">
                  No Providers Found
                </td>
              </tr>
            ) : (
              providers.map((provider) => (
                <tr key={provider.id} className="border-b">
                  <td className="py-4">{provider.name}</td>

                  <td>{provider.tracking_base_url}</td>

                  <td>
                    <button
                      onClick={() => handleEdit(provider)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(provider.id)}
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
    </div>
  );
}
