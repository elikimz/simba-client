// src/pages/admin/AdminDashboard.tsx
import { Link } from "react-router-dom";

const cards = [
  { title: "Products", to: "/admin/products" },
  { title: "Categories", to: "/admin/categories" },
  { title: "Deals", to: "/admin/deals" },
  { title: "Hero Banners", to: "/admin/banners" },
  { title: "Orders", to: "/admin/orders" },
  { title: "Messages", to: "/admin/messages" },
  { title: "Users", to: "/admin/users" },
  { title: "Settings", to: "/admin/settings" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Quick access to admin tools.</p>
        </div>

        <div className="rounded-2xl bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">
          Tip: Use the sidebar to manage modules
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow"
          >
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-gray-900">{c.title}</div>
              <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-900">
                Open
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-500">
              Manage {c.title.toLowerCase()}.
            </div>

            <div className="mt-5 text-sm font-semibold text-indigo-900">Go →</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;