import { useEffect, useState } from "react";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../services/user.service";

interface User {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "ADMIN",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    username: "",
    role: "ADMIN",
  });

  async function loadUsers() {
    try {
      const res = await getUsers();
      setUsers(res.users);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(form);

      alert("User Created Successfully");

      setForm({
        username: "",
        password: "",
        role: "ADMIN",
      });

      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
    finally {
  setLoading(false);
}
  }
async function handleUpdate() {
  if (!editingId) return;

  setLoading(true);

  try {
    await updateUser(editingId,editForm);

    alert("User Updated Successfully");

    setEditingId(null);

    setEditForm({
      username: "",
      role: "ADMIN",
    });

    loadUsers();
  } catch (err: any) {
    alert(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
} 
 async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      alert("User Deleted Successfully");

      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {/* Create User */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border rounded-lg p-6 mb-8 bg-white shadow"
      >
        <h2 className="text-xl font-semibold">Create User</h2>

        <input
          className="border p-2 rounded w-full"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="border p-2 rounded w-full"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <select
          className="border p-2 rounded w-full"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
        >
          <option value="ADMIN">ADMIN</option>
          <option value="STAFF">STAFF</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Loading..." : "Create User"}
        </button>
      </form>

      {/* Edit User */}

      {editingId && (
        <div className="border rounded-lg p-6 mb-8 bg-yellow-50 shadow">
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>

          <input
            className="border p-2 rounded w-full mb-4"
            value={editForm.username}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                username: e.target.value,
              })
            }
          />

          <select
            className="border p-2 rounded w-full mb-4"
            value={editForm.role}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                role: e.target.value,
              })
            }
          >
            <option value="ADMIN">ADMIN</option>
            <option value="STAFF">STAFF</option>
          </select>

          <div className="flex gap-3">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-60"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Loading..." : "Save"}
            </button>

            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Username</th>
            <th className="border p-3">Role</th>
            <th className="border p-3">Created</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-3">{user.username}</td>

              <td className="border p-3">{user.role}</td>

              <td className="border p-3">
                {new Date(user.created_at).toLocaleString()}
              </td>

              <td className="border p-3">
                <div className="flex gap-2 justify-center">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setEditingId(user.id);

                      setEditForm({
                        username: user.username,
                        role: user.role,
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-6 text-gray-500">
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
