


// src/pages/CartPage.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  type LocalCart,
  clearLocalCart,
  getLocalCart,
  removeFromLocalCart,
  updateLocalCartItem,
} from "../utils/localCart";
import {
  useGetMyCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "../features/cart/cartAPI";

function formatKES(amount: number) {
  return `KSh${Number(amount || 0).toLocaleString()}.00`;
}

function isLoggedIn() {
  const token = localStorage.getItem("access_token");
  return Boolean(token && token.trim().length > 0);
}

type NormalizedItem = {
  key: string;
  mode: "local" | "api";
  item_id: number | null; // api item id
  product_id: number;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export default function CartPage() {
  const navigate = useNavigate();

  // ✅ reactive login state (so if user logs in, cart switches to API without refresh)
  const [loggedIn, setLoggedIn] = useState<boolean>(() => isLoggedIn());

  useEffect(() => {
    const sync = () => setLoggedIn(isLoggedIn());
    window.addEventListener("storage", sync);

    // if you have a custom event in your login logic, this makes it instant:
    window.addEventListener("auth-changed", sync as any);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-changed", sync as any);
    };
  }, []);

  // -------------------------
  // ✅ Local cart (guest mode)
  // -------------------------
  const [localCart, setLocalCart] = useState<LocalCart>(() => getLocalCart());

  useEffect(() => {
    if (loggedIn) return; // don't listen in logged-in mode
    const sync = () => setLocalCart(getLocalCart());
    sync();
    window.addEventListener("local-cart-updated", sync);
    return () => window.removeEventListener("local-cart-updated", sync);
  }, [loggedIn]);

  // -------------------------
  // ✅ Backend cart (auth mode)
  // -------------------------
  const {
    data: apiCart,
    isLoading: apiLoading,
    isError: apiError,
    refetch: refetchApiCart,
  } = useGetMyCartQuery(undefined, { skip: !loggedIn });

  const [updateCartItem, { isLoading: updatingItem }] = useUpdateCartItemMutation();
  const [removeCartItem, { isLoading: removingItem }] = useRemoveCartItemMutation();

  // -------------------------
  // ✅ Normalize cart for UI
  // -------------------------
  const items: NormalizedItem[] = useMemo(() => {
    if (loggedIn) {
      return (apiCart?.items ?? []).map((it) => ({
        key: `api-${it.id}`,
        mode: "api",
        item_id: it.id,
        product_id: Number(it.product_id),
        name: it.product_name ?? `Product #${it.product_id}`,
        price: Number(it.product_price ?? 0),
        image_url: it.product_image_url ?? null,
        quantity: Number(it.quantity ?? 1),
      }));
    }

    return (localCart.items ?? []).map((it) => ({
      key: `local-${it.product_id}`,
      mode: "local",
      item_id: null,
      product_id: Number(it.product_id),
      name: it.name,
      price: Number(it.price ?? 0),
      image_url: it.image_url ?? null,
      quantity: Number(it.quantity ?? 1),
    }));
  }, [loggedIn, apiCart, localCart]);

  const totals = useMemo(() => {
    const count = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    const total = items.reduce(
      (sum, it) => sum + (it.quantity || 0) * (it.price || 0),
      0
    );
    return { count, total };
  }, [items]);

  // WhatsApp message works for both modes
  const message = useMemo(() => {
    if (!items.length) return "";
    const lines = items.map((it, i) => {
      const lineTotal = it.quantity * (it.price || 0);
      return `${i + 1}. ${it.name} — Qty: ${it.quantity} — ${formatKES(lineTotal)}`;
    });
    lines.push(`Total: ${formatKES(totals.total)}`);
    return lines.join("\n");
  }, [items, totals.total]);

  const whatsappLink = useMemo(() => {
    const WHATSAPP_NUMBER = "254700000000"; // change to your number
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hi, I want to order:\n\n${message}`
    )}`;
  }, [message]);

  // ✅ Helpers that always keep UI in sync
  const refreshIfApi = useCallback(() => {
    if (loggedIn) refetchApiCart();
  }, [loggedIn, refetchApiCart]);

  async function handleRemove(it: NormalizedItem) {
    if (it.mode === "local") {
      removeFromLocalCart(it.product_id);
      setLocalCart(getLocalCart());
      return;
    }

    try {
      await removeCartItem(it.item_id as number).unwrap();
      refreshIfApi();
    } catch (e: any) {
      if (String(e?.status) === "401") {
        setLoggedIn(false);
        navigate("/signin", { state: { from: "/cart" } });
        return;
      }
      alert(e?.data?.detail || "Failed to remove item.");
    }
  }

  async function handleSetQty(it: NormalizedItem, qty: number) {
    const next = Math.max(1, qty);

    if (it.mode === "local") {
      updateLocalCartItem(it.product_id, next);
      setLocalCart(getLocalCart());
      return;
    }

    try {
      await updateCartItem({ item_id: it.item_id as number, body: { quantity: next } }).unwrap();
      refreshIfApi();
    } catch (e: any) {
      if (String(e?.status) === "401") {
        setLoggedIn(false);
        navigate("/signin", { state: { from: "/cart" } });
        return;
      }
      alert(e?.data?.detail || "Failed to update item.");
    }
  }

  async function handleClear() {
    if (!items.length) return;

    if (!loggedIn) {
      clearLocalCart();
      setLocalCart(getLocalCart());
      return;
    }

    // ✅ remove each api item (until you add /cart/clear endpoint)
    const apiItems = apiCart?.items ?? [];
    await Promise.allSettled(apiItems.map((it) => removeCartItem(it.id).unwrap()));
    refreshIfApi();
  }

  function handleCheckout() {
    if (!items.length) return;

    // ✅ if not logged in, go login then return to /cart and continue
    if (!loggedIn) {
      navigate("/signin", { state: { from: "/cart", next: "/addresses" } });
      return;
    }

    // ✅ go to address page first for checkout flow
    navigate("/addresses", { state: { next: "/checkout" } });
  }

  const loading = loggedIn ? apiLoading : false;
  const error = loggedIn ? apiError : false;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
            <p className="mt-1 text-sm text-gray-600">
              {loading ? "Loading..." : `${totals.count} item(s) • ${formatKES(totals.total)}`}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Mode: {loggedIn ? "Account Cart" : "Guest Cart"}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50"
            >
              ← Continue Shopping
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!items.length || removingItem}
              className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              {removingItem ? "Clearing..." : "Clear Cart"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
            <div className="text-sm font-extrabold">Failed to load cart.</div>
            <button
              onClick={() => refetchApiCart()}
              className="mt-4 rounded-2xl bg-rose-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-rose-800"
              type="button"
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* Empty */}
        {!loading && !items.length ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">
            <div className="text-5xl">🛒</div>
            <div className="mt-3 text-lg font-extrabold text-gray-900">Your cart is empty</div>
            <p className="mt-2 text-sm text-gray-600">Add products to cart to place an order.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-extrabold text-white hover:bg-black"
              type="button"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => {
                const lineTotal = it.quantity * (it.price || 0);

                const qtyBusy = updatingItem; // simplest (later: per-item busy map)
                const removeBusy = removingItem;

                return (
                  <div key={it.key} className="rounded-3xl bg-white p-4 shadow-sm">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gray-100">
                        {it.image_url ? (
                          <img
                            src={it.image_url}
                            alt={it.name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            🖼️
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-base font-extrabold text-gray-900">
                              {it.name}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              Unit: {formatKES(it.price)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(it)}
                            disabled={removeBusy}
                            className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          {/* Qty control */}
                          <div className="inline-flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-1">
                            <button
                              type="button"
                              className="h-10 w-10 rounded-xl text-xl font-bold hover:bg-white disabled:opacity-60"
                              disabled={qtyBusy}
                              onClick={() => handleSetQty(it, it.quantity - 1)}
                            >
                              −
                            </button>
                            <div className="w-14 text-center text-sm font-extrabold text-gray-900">
                              {it.quantity}
                            </div>
                            <button
                              type="button"
                              className="h-10 w-10 rounded-xl text-xl font-bold hover:bg-white disabled:opacity-60"
                              disabled={qtyBusy}
                              onClick={() => handleSetQty(it, it.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-right">
                            <div className="text-xs font-bold text-gray-500">Line Total</div>
                            <div className="text-lg font-extrabold text-gray-900">
                              {formatKES(lineTotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick link to product */}
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${it.product_id}`)}
                      className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50"
                    >
                      View Product
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="text-lg font-extrabold text-gray-900">Order Summary</div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-extrabold text-gray-900">{totals.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-extrabold text-gray-900">
                    {formatKES(totals.total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                <div className="text-xs font-bold text-gray-500">Total Amount</div>
                <div className="mt-1 text-2xl font-extrabold text-gray-900">
                  {formatKES(totals.total)}
                </div>
              </div>

              {/* Order buttons */}
              <div className="mt-6 space-y-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-base font-extrabold text-white hover:bg-emerald-600"
                >
                  💬 Order via WhatsApp
                </a>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full rounded-2xl bg-gray-900 px-5 py-4 text-base font-extrabold text-white hover:bg-black disabled:opacity-60"
                  disabled={!items.length || loading}
                >
                  Proceed to Checkout
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Tip: WhatsApp order will send your cart list + total automatically.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}