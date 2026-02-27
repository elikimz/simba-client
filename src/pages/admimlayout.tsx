// src/components/admin/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";

type NavItem = { label: string; to: string };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", to: "/admin" }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", to: "/admin/products" },
      { label: "Categories", to: "/admin/categories" },
      { label: "Deals", to: "/admin/deals" },
    ],
  },
  {
    title: "Content",
    items: [{ label: "Hero Banners", to: "/admin/banners" }],
  },
  {
    title: "Sales",
    items: [{ label: "Orders", to: "/admin/orders" }],
  },
  {
    title: "Support",
    items: [{ label: "Messages", to: "/admin/messages" }],
  },
  {
    title: "Access",
    items: [{ label: "Users", to: "/admin/users" }],
  },
  {
    title: "System",
    items: [{ label: "Settings", to: "/admin/settings" }],
  },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
              <div className="min-w-0">
                <div className="truncate text-lg font-extrabold text-gray-900">
                  SIMBA ADMIN
                </div>
                <div className="truncate text-xs text-gray-500">
                  Manage store & content
                </div>
              </div>
              <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-900">
                Admin
              </span>
            </div>

            <nav className="p-3">
              <div className="space-y-4">
                {groups.map((g) => (
                  <div key={g.title}>
                    <div className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {g.title}
                    </div>

                    <div className="space-y-1">
                      {g.items.map((it) => (
                        <NavLink
                          key={it.to}
                          to={it.to}
                          end={it.to === "/admin"}
                          className={({ isActive }) =>
                            [
                              "flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold transition",
                              isActive
                                ? "bg-indigo-900 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100",
                            ].join(" ")
                          }
                          children={({ isActive }) => (
                            <>
                              <span className="truncate">{it.label}</span>
                              <span
                                className={[
                                  "text-xs",
                                  isActive ? "text-white/80" : "text-gray-400",
                                ].join(" ")}
                              >
                                →
                              </span>
                            </>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main */}
          <main className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;