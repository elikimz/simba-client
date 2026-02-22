// src/pages/OrdersPage.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../../components/navbar/userNavbar";
import { useListMyOrdersQuery, type OrderResponse } from "../order/orderAPI";

function kes(n: number) {
  return `KSh${Number(n || 0).toLocaleString()}.00`;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function badgeClass(status: string) {
  const s = (status || "").toLowerCase();
  if (["paid", "shipped", "delivered"].includes(s)) return "bg-emerald-50 text-emerald-700";
  if (["cancelled", "canceled", "failed"].includes(s)) return "bg-rose-50 text-rose-700";
  if (["pending", "processing"].includes(s)) return "bg-amber-50 text-amber-700";
  return "bg-gray-100 text-gray-700";
}

export default function OrdersPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useListMyOrdersQuery();

  // sort newest first
  const orders = useMemo(() => {
    const list = [...(data ?? [])];
    list.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return db - da;
    });
    return list;
  }, [data]);

  const cartCount = 0;
  const cartTotalLabel = "KSh0.00";

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavBar
        logoSrc="/logo.png"
        searchValue=""
        onSearchChange={() => {}}
        cartCount={cartCount}
        cartTotalLabel={cartTotalLabel}
        onCartClick={() => navigate("/cart")}
        wishlistCount={0}
      />

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
            <p className="mt-1 text-sm text-gray-600">
              {isLoading ? "Loading orders..." : `${orders.length} order(s)`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => navigate("/user")}
              className="rounded-2xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-black"
            >
              Continue Shopping →
            </button>
          </div>
        </div>

        {/* Error */}
        {isError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
            <div className="text-sm font-extrabold">Failed to load orders.</div>
            <div className="mt-1 text-xs opacity-80">
              {(error as any)?.data?.detail || "Please try again."}
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-2xl bg-rose-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-rose-800"
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* Empty */}
        {!isLoading && !isError && orders.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="text-5xl">📦</div>
            <div className="mt-3 text-lg font-extrabold text-gray-900">No orders yet</div>
            <p className="mt-2 text-sm text-gray-600">
              Place an order and it will appear here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/user")}
              className="mt-6 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-extrabold text-white hover:bg-black"
            >
              Browse Products
            </button>
          </div>
        ) : null}

        {/* List */}
        {!isLoading && !isError && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}

function OrderCard({ order }: { order: OrderResponse }) {
  const itemsCount =
    order.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) ?? 0;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-extrabold text-gray-900">
              Order #{order.id}
            </div>
            <span
              className={[
                "rounded-full px-2.5 py-1 text-xs font-extrabold",
                badgeClass(order.status),
              ].join(" ")}
            >
              {order.status}
            </span>
          </div>

          <div className="mt-1 text-xs text-gray-600">
            Placed: {formatDate(order.created_at)}
          </div>

          <div className="mt-2 text-sm text-gray-700">
            {itemsCount} item(s) •{" "}
            <span className="font-extrabold text-gray-900">
              {kes(order.total_amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}