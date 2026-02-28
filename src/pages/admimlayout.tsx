


// src/components/admin/AdminLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  // LayoutDashboard,
  Package,
  Tags,
  BadgePercent,
  Image as ImageIcon,
  ShoppingBag,
  Mail,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

type NavItem = { label: string; to: string; icon: React.ReactNode };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  // {
  //   title: "Overview",
  //   items: [
  //     { label: "Dashboard", to: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  //   ],
  // },
  {
    title: "Catalog",
    items: [
      { label: "Products", to: "/admin/products", icon: <Package className="h-4 w-4" /> },
      { label: "Categories", to: "/admin/categories", icon: <Tags className="h-4 w-4" /> },
      { label: "Deals", to: "/admin/deals", icon: <BadgePercent className="h-4 w-4" /> },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Hero Banners", to: "/admin/banners", icon: <ImageIcon className="h-4 w-4" /> },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", to: "/admin/orders", icon: <ShoppingBag className="h-4 w-4" /> },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Messages", to: "/admin/messages", icon: <Mail className="h-4 w-4" /> },
    ],
  },
  // ✅ Settings removed
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Adjust these to match your auth setup:
    // - if you use redux auth slice, dispatch(logout()) here
    // - if you store token in localStorage/cookies, clear it here
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
              <div className="min-w-0">
                <div className="truncate text-lg font-extrabold text-gray-900">
                  SIMBA ADMIN
                </div>
                <div className="truncate text-xs text-gray-500">
                  Manage store & content
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-900">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </span>
            </div>

            {/* Nav */}
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
                              "group flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold transition",
                              isActive
                                ? "bg-indigo-900 text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100",
                            ].join(" ")
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span className="flex min-w-0 items-center gap-2">
                                <span
                                  className={[
                                    "grid h-8 w-8 place-items-center rounded-xl border transition",
                                    isActive
                                      ? "border-white/15 bg-white/10"
                                      : "border-gray-200 bg-white group-hover:bg-gray-50",
                                  ].join(" ")}
                                >
                                  <span
                                    className={[
                                      isActive ? "text-white" : "text-gray-600",
                                    ].join(" ")}
                                  >
                                    {it.icon}
                                  </span>
                                </span>

                                <span className="truncate">{it.label}</span>
                              </span>

                              <span
                                className={[
                                  "text-xs transition",
                                  isActive ? "text-white/80" : "text-gray-400",
                                ].join(" ")}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </span>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>

            {/* Footer / Logout */}
            <div className="border-t border-gray-100 p-3">
              <button
                type="button"
                onClick={logout}
                className="group flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-extrabold text-gray-700 transition hover:bg-red-50"
              >
                <span className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl border border-gray-200 bg-white transition group-hover:border-red-200 group-hover:bg-red-100/40">
                    <LogOut className="h-4 w-4 text-red-600" />
                  </span>
                  Logout
                </span>
                <span className="text-gray-400 group-hover:text-red-600">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>

              <div className="px-3 pt-2 text-[11px] text-gray-400">
                You’ll be redirected to login.
              </div>
            </div>
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