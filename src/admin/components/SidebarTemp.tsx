import { NavLink } from "react-router-dom";



export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "STAFF";

  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Bookings", path: "/admin/bookings" },

    ...(role === "ADMIN"
      ? [
          { name: "Providers", path: "/admin/providers" },
          { name: "Users", path: "/admin/users" },
        ]
      : []),
  ];
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-xl font-bold">TrackMyCourier</h1>
        <p className="text-xs text-slate-400">
          {role === "ADMIN" ? "Admin Panel" : "Staff Panel"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 flex flex-col">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `px-6 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-slate-700 p-4">
        <p className="text-sm font-semibold">{user?.username || "User"}</p>
        <p className="text-xs text-slate-400">{role}</p>
      </div>
    </aside>
  );
}
