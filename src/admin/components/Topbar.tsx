import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "STAFF";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-gray-800">
            {user?.username || "User"}
          </p>
          <p
            className={`text-xs font-medium ${
              role === "ADMIN" ? "text-blue-600" : "text-green-600"
            }`}
          >
            {role}
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
