import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboard.service";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    bookings: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getDashboardStats();

        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-2 text-gray-500">
        Welcome to TrackMyCourier Admin Panel
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">Total Users</h2>
          <p className="mt-3 text-4xl font-bold">{stats.users}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">Providers</h2>
          <p className="mt-3 text-4xl font-bold">{stats.providers}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">Bookings</h2>
          <p className="mt-3 text-4xl font-bold">{stats.bookings}</p>
        </div>
      </div>
    </div>
  );
}
