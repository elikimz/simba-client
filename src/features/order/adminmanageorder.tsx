// src/admin/AdminManageOrders.tsx
import { useEffect, useMemo, useState } from "react";
import {
  useAdminListAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../features/order/orderAPI";
import type {
  OrderItemResponse,
  OrderResponse,
} from "../../features/order/orderAPI";

/**
 * ✅ Must match FastAPI enum values EXACTLY (lowercase)
 */
const STATUS_VALUES = ["pending", "shipped", "delivered", "cancelled"] as const;

const statusLabel = (s: string) => (s ? s.toUpperCase() : "—");

const fmt = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const money = (n: any) => {
  const v = Number(n ?? 0);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    return String(v);
  }
};

const pillClass = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "delivered")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (s === "shipped") return "border-blue-200 bg-blue-50 text-blue-700";
  if (s === "cancelled") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
};

// --- your admin API returns buyer + address, so we model them here ---
type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

type AdminAddress = {
  id: number;
  full_name: string;
  phone: string;
  county: string;
  town: string;
  street: string;
};

type AdminOrder = OrderResponse & {
  buyer_id?: number; // backend field
  user_id?: number; // fallback field
  buyer?: AdminUser | null;
  address?: AdminAddress | null;
  subtotal?: number;
  shipping_fee?: number;
  notes?: string | null;
};

const addressOneLine = (a?: AdminAddress | null) => {
  if (!a) return "—";
  return `${a.full_name} • ${a.phone} • ${a.county}, ${a.town}, ${a.street}`;
};

const lineTotal = (it: OrderItemResponse) => {
  // prefer backend line_total, else compute from product_price if available
  if (it.line_total != null) return Number(it.line_total);
  const p = it.product_price == null ? null : Number(it.product_price);
  if (p == null || Number.isNaN(p)) return null;
  return p * Number(it.quantity ?? 0);
};

function OrderDetailsModal({
  open,
  order,
  onClose,
  onSetStatus,
  busy,
}: {
  open: boolean;
  order: AdminOrder | null;
  onClose: () => void;
  onSetStatus: (order_id: number, new_status: string) => void;
  busy: boolean;
}) {
  // lock page scroll behind modal
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !order) return null;

  const buyerName = order.buyer?.name ?? `#${order.buyer_id ?? "—"}`;
  const buyerEmail = order.buyer?.email ?? "—";
  const buyerPhone = order.buyer?.phone ?? "—";

  const computedSubtotal =
    order.subtotal != null ? Number(order.subtotal) : null;
  const computedShipping =
    order.shipping_fee != null ? Number(order.shipping_fee) : null;

  // if backend didn't send subtotal/shipping, compute subtotal from items if possible
  const fallbackSubtotal = (order.items ?? []).reduce((acc, it) => {
    const lt = lineTotal(it);
    return acc + (lt ?? 0);
  }, 0);

  const subtotalShown =
    computedSubtotal != null && !Number.isNaN(computedSubtotal)
      ? computedSubtotal
      : fallbackSubtotal;

  const shippingShown =
    computedShipping != null && !Number.isNaN(computedShipping)
      ? computedShipping
      : Math.max(0, Number(order.total_amount ?? 0) - subtotalShown);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative flex min-h-full items-start justify-center">
        <div className="relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                Order #{order.id}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Created: {fmt(order.created_at)} • Status:{" "}
                <span
                  className={[
                    "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-extrabold",
                    pillClass(order.status),
                  ].join(" ")}
                >
                  {statusLabel(order.status)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          {/* Body (scrolls when tall) */}
          <div className="max-h-[calc(100vh-160px)] overflow-y-auto">
            <div className="grid gap-4 p-5 lg:grid-cols-[1fr_360px]">
              {/* Left: Items */}
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div className="text-sm font-extrabold text-slate-900">
                    Items ({(order.items ?? []).length})
                  </div>
                  <div className="text-xs text-slate-500">
                    Total:{" "}
                    <span className="font-extrabold">
                      {money(order.total_amount)}
                    </span>
                  </div>
                </div>

                {/* ✅ Items list scrolls but modal also scrolls if needed */}
                <div className="p-4">
                  {(order.items ?? []).length === 0 ? (
                    <div className="text-sm text-slate-500">No items.</div>
                  ) : (
                    <div className="grid gap-3">
                      {(order.items ?? []).map((it) => {
                        const lt = lineTotal(it);
                        return (
                          <div
                            key={it.id}
                            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-[220px]">
                                <div className="text-sm font-extrabold text-slate-900">
                                  {it.product_name ??
                                    `Product #${it.product_id}`}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-bold">
                                    Product ID: {it.product_id}
                                  </span>
                                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-bold">
                                    Qty: {it.quantity}
                                  </span>
                                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-bold">
                                    Price:{" "}
                                    {it.product_price == null
                                      ? "—"
                                      : money(it.product_price)}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-xs text-slate-500">
                                  Line total
                                </div>
                                <div className="text-sm font-extrabold text-slate-900">
                                  {lt == null ? "—" : money(lt)}
                                </div>
                              </div>
                            </div>

                            {it.product_image_url && (
                              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <img
                                  src={it.product_image_url}
                                  alt={it.product_name ?? "Product"}
                                  className="h-44 w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Buyer + Address + Actions */}
              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-extrabold text-slate-900">
                    Buyer
                  </div>
                  <div className="mt-2 grid gap-1 text-sm">
                    <div className="font-extrabold text-slate-900">
                      {buyerName}
                    </div>
                    <div className="text-slate-600">{buyerEmail}</div>
                    <div className="text-slate-600">{buyerPhone}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      Buyer ID: {order.buyer_id ?? order.user_id ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-extrabold text-slate-900">
                    Delivery address
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {addressOneLine(order.address)}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Address ID: {order.address_id ?? order.address?.id ?? "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-extrabold text-slate-900">
                    Payment summary
                  </div>
                  <div className="mt-2 grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-extrabold">
                        {money(subtotalShown)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-extrabold">
                        {money(shippingShown)}
                      </span>
                    </div>
                    <div className="my-1 h-px bg-slate-100" />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Total</span>
                      <span className="font-extrabold">
                        {money(order.total_amount)}
                      </span>
                    </div>

                    {order.notes && (
                      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                        <div className="font-extrabold text-slate-900">
                          Notes
                        </div>
                        <div className="mt-1">{order.notes}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-extrabold text-slate-900">
                    Update status
                  </div>
                  <div className="mt-3 grid gap-2">
                    {STATUS_VALUES.map((s) => (
                      <button
                        key={s}
                        disabled={busy || order.status === s}
                        onClick={() => onSetStatus(order.id, s)}
                        className={[
                          "w-full rounded-xl border px-3 py-2 text-sm font-extrabold transition",
                          order.status === s
                            ? "border-slate-200 bg-slate-100 text-slate-500"
                            : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
                          busy ? "opacity-60" : "",
                        ].join(" ")}
                      >
                        Set {statusLabel(s)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Uses query param <b>new_status</b>{" "}
                    (pending/shipped/delivered/cancelled).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="text-[11px] text-slate-500">
              Tip: Click outside this box to close. Press ESC to close.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminManageOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const {
    data: orders,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAdminListAllOrdersQuery(
    statusFilter ? { status: statusFilter } : undefined
  );

  const [updateStatus, updateMeta] = useUpdateOrderStatusMutation();

  const busy = isLoading || isFetching || updateMeta.isLoading;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const filtered = useMemo(() => {
    const list = (orders ?? []) as AdminOrder[];
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((o) => {
      const id = String(o.id);
      const buyerId = String(o.buyer_id ?? o.user_id ?? "");
      const buyerName = (o.buyer?.name ?? "").toLowerCase();
      const st = (o.status ?? "").toLowerCase();

      const addr = [
        o.address?.full_name,
        o.address?.phone,
        o.address?.county,
        o.address?.town,
        o.address?.street,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const itemsText = (o.items ?? [])
        .map((i) => i.product_name ?? String(i.product_id))
        .join(" ")
        .toLowerCase();

      return (
        id.includes(q) ||
        buyerId.includes(q) ||
        buyerName.includes(q) ||
        st.includes(q) ||
        addr.includes(q) ||
        itemsText.includes(q)
      );
    });
  }, [orders, query]);

  const onSetStatus = async (order_id: number, new_status: string) => {
    const ok = window.confirm(
      `Update order #${order_id} to "${statusLabel(new_status)}"?`
    );
    if (!ok) return;

    try {
      const res = await updateStatus({ order_id, new_status }).unwrap();
      showToast(res?.message || "Order status updated.");
      refetch();

      // keep modal data in sync (optimistic update)
      setSelected((prev) =>
        prev && prev.id === order_id ? { ...prev, status: new_status } : prev
      );
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.error ||
        e?.message ||
        "Failed to update status. Check API/token.";
      showToast(String(msg));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-emerald-100/50 via-teal-100/30 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Admin · Orders
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Click an order to view full details (buyer + address + all items).
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={busy}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm">
            <div>{toast}</div>
            <button
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50"
              onClick={() => setToast(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm md:grid-cols-[240px_1fr]">
          <label className="grid gap-1.5">
            <span className="text-xs font-extrabold text-slate-700">
              Filter by status
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">All statuses</option>
              {STATUS_VALUES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-extrabold text-slate-700">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order id, buyer, status, address, product…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-extrabold">Orders</h3>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
              {busy ? "Working…" : `${filtered.length} order(s)`}
            </span>
          </div>

          <div className="p-4">
            {error && (
              <div className="text-sm font-bold text-red-600">
                Failed to load orders. Check admin route + token.
              </div>
            )}
            {isLoading && (
              <p className="text-sm text-slate-600">Loading orders…</p>
            )}

            {/* Desktop */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    {["Order", "Buyer", "Status", "Total", "Created", "Items", "Open"].map(
                      (h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap border-b border-slate-100 px-2 py-3"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-b border-slate-50">
                      <td className="px-2 py-3">
                        <div className="font-extrabold">#{o.id}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          Address: {o.address?.town ?? "—"} •{" "}
                          {o.address?.county ?? "—"}
                        </div>
                      </td>

                      <td className="px-2 py-3">
                        <div className="font-extrabold text-slate-900">
                          {o.buyer?.name ?? `#${o.buyer_id ?? o.user_id ?? "—"}`}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {o.buyer?.email ?? "—"}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-2 py-3">
                        <span
                          className={[
                            "rounded-full border px-2.5 py-1 text-xs font-extrabold",
                            pillClass(o.status),
                          ].join(" ")}
                        >
                          {statusLabel(o.status ?? "—")}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-2 py-3 font-extrabold">
                        {money(o.total_amount)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
                        {fmt(o.created_at)}
                      </td>

                      <td className="px-2 py-3">
                        <div className="text-xs text-slate-700">
                          {(o.items ?? []).length} item(s)
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {o.items?.[0]?.product_name
                            ? `e.g. ${o.items[0].product_name}`
                            : "—"}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-2 py-3">
                        <button
                          onClick={() => setSelected(o)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!isLoading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-2 py-4 text-sm text-slate-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="grid gap-3 lg:hidden">
              {filtered.map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold">Order #{o.id}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {o.buyer?.name ?? `Buyer #${o.buyer_id ?? "—"}`} •{" "}
                        {fmt(o.created_at)}
                      </div>
                    </div>
                    <span
                      className={[
                        "rounded-full border px-2.5 py-1 text-xs font-extrabold",
                        pillClass(o.status),
                      ].join(" ")}
                    >
                      {statusLabel(o.status ?? "—")}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                      Total: {money(o.total_amount)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                      Items: {(o.items ?? []).length}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelected(o)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold hover:bg-slate-50"
                  >
                    View full details
                  </button>
                </div>
              ))}
            </div>

            {updateMeta.isError && (
              <div className="mt-3 text-sm font-bold text-red-600">
                Status update failed. Use exactly: pending / shipped / delivered /
                cancelled.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Modal that shows ALL products (no hiding) + scrolls properly */}
      <OrderDetailsModal
        open={!!selected}
        order={selected}
        onClose={() => setSelected(null)}
        onSetStatus={onSetStatus}
        busy={busy}
      />
    </div>
  );
}