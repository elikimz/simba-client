

// // src/pages/AddressesPage.tsx
// import { useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import UserNavBar from "../../components/navbar/userNavbar";
// import {
//   useListMyAddressesQuery,
//   useCreateAddressMutation,
//   useUpdateAddressMutation,
//   useDeleteAddressMutation,
//   type AddressResponse,
//   type AddressCreateInput,
// } from "../../features/addresses/addressAPI";

// // ✅ import checkout mutation
// import { useCheckoutOrderMutation } from "../../features/order/orderAPI";

// export default function AddressesPage() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // after successful checkout where to go
//   // - default: /orders
//   // - you can pass { next: "/orders" } from CartPage
//   const nextPath = (location.state as any)?.next || "/orders";

//   const { data: addresses, isLoading, isError, error, refetch } =
//     useListMyAddressesQuery();

//   const [createAddress, { isLoading: creating }] = useCreateAddressMutation();
//   const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
//   const [deleteAddress, { isLoading: deleting }] = useDeleteAddressMutation();

//   // ✅ checkout mutation (order is created here)
//   const [checkoutOrder, { isLoading: checkingOut }] = useCheckoutOrderMutation();

//   // basic form state
//   const [form, setForm] = useState<AddressCreateInput>({
//     full_name: "",
//     phone: "",
//     county: "",
//     town: "",
//     street: "",
//   });

//   const [editId, setEditId] = useState<number | null>(null);

//   // tiny toast
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastText, setToastText] = useState("");

//   const saving = creating || updating;
//   const busy = saving || deleting || checkingOut;

//   const title = useMemo(() => {
//     if (editId != null) return "Edit Address";
//     return "Add New Address";
//   }, [editId]);

//   function showToast(msg: string) {
//     setToastText(msg);
//     setToastOpen(true);
//     window.setTimeout(() => setToastOpen(false), 2500);
//   }

//   function onChange<K extends keyof AddressCreateInput>(key: K, value: string) {
//     setForm((p) => ({ ...p, [key]: value }));
//   }

//   function resetForm() {
//     setForm({ full_name: "", phone: "", county: "", town: "", street: "" });
//     setEditId(null);
//   }

//   function startEdit(a: AddressResponse) {
//     setEditId(a.id);
//     setForm({
//       full_name: a.full_name ?? "",
//       phone: a.phone ?? "",
//       county: a.county ?? "",
//       town: a.town ?? "",
//       street: a.street ?? "",
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   // ✅ Create order using selected address
//   async function placeOrder(address_id: number) {
//     try {
//       showToast("Placing your order...");

//       // Most backends expect { address_id }
//       // If your backend expects a different key, tell me and I’ll adjust.
//       const createdOrder = await checkoutOrder({ address_id }).unwrap();

//       showToast("✅ Order placed successfully");

//       // ✅ Go to order details if your API returns order.id
//       // Fallback: go to /orders
//       const orderId = (createdOrder as any)?.id;

//       if (orderId) {
//         navigate("/orders", { replace: true });
//       } else {
//         navigate(nextPath, { replace: true });
//       }
//     } catch (err: any) {
//       if (String(err?.status) === "401") {
//         navigate("/signin", { state: { from: "/addresses", next: "/addresses" } });
//         return;
//       }
//       showToast(err?.data?.detail || "Checkout failed. Please try again.");
//     }
//   }

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();

//     // simple validation
//     const required: Array<keyof AddressCreateInput> = [
//       "full_name",
//       "phone",
//       "county",
//       "town",
//       "street",
//     ];
//     for (const k of required) {
//       if (!String(form[k] ?? "").trim()) {
//         showToast(`Please fill ${k.replace("_", " ")}`);
//         return;
//       }
//     }

//     try {
//       if (editId != null) {
//         await updateAddress({ address_id: editId, body: form }).unwrap();
//         showToast("✅ Address updated");
//         resetForm();
//         return;
//       }

//       // ✅ create address then immediately checkout with it
//       const created = await createAddress(form).unwrap();
//       showToast("✅ Address saved. Completing checkout...");
//       resetForm();

//       // ✅ immediately place order
//       await placeOrder(created.id);
//     } catch (err: any) {
//       if (String(err?.status) === "401") {
//         navigate("/signin", { state: { from: "/addresses", next: "/addresses" } });
//         return;
//       }
//       showToast(err?.data?.detail || "Failed to save address");
//     }
//   }

//   // ✅ selecting an address completes order
//   async function chooseForCheckout(a: AddressResponse) {
//     await placeOrder(a.id);
//   }

//   async function removeAddress(id: number) {
//     const ok = window.confirm("Delete this address?");
//     if (!ok) return;

//     try {
//       await deleteAddress(id).unwrap();
//       showToast("🗑️ Address deleted");
//     } catch (err: any) {
//       if (String(err?.status) === "401") {
//         navigate("/signin", { state: { from: "/addresses", next: "/addresses" } });
//         return;
//       }
//       showToast(err?.data?.detail || "Failed to delete address");
//     }
//   }

//   // navbar props (keep simple)
//   const cartCount = 0;
//   const cartTotalLabel = "KSh0.00";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <UserNavBar
//         logoSrc="/logo.png"
//         searchValue=""
//         onSearchChange={() => {}}
//         cartCount={cartCount}
//         cartTotalLabel={cartTotalLabel}
//         onCartClick={() => navigate("/cart")}
//         wishlistCount={0}
//       />

//       {/* toast */}
//       {toastOpen ? (
//         <div className="fixed bottom-5 right-5 z-50 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
//           <div className="text-sm font-extrabold text-gray-900">Notice</div>
//           <div className="mt-1 text-xs text-gray-700">{toastText}</div>
//         </div>
//       ) : null}

//       <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mb-6 flex items-center justify-between gap-3">
//           <div>
//             <h1 className="text-2xl font-extrabold text-gray-900">Delivery Address</h1>
//             <p className="mt-1 text-sm text-gray-600">
//               Add/select an address to complete checkout.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50"
//             disabled={busy}
//           >
//             ← Back
//           </button>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* Form */}
//           <section className="lg:col-span-1">
//             <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="mb-4">
//                 <div className="text-sm font-extrabold text-gray-900">{title}</div>
//                 <div className="text-xs text-gray-600">
//                   {editId != null
//                     ? "Update your address details"
//                     : "Save an address and we will place your order"}
//                 </div>
//               </div>

//               <form onSubmit={submit} className="space-y-3">
//                 <Field
//                   label="Full name"
//                   value={form.full_name}
//                   onChange={(v) => onChange("full_name", v)}
//                 />
//                 <Field
//                   label="Phone"
//                   value={form.phone}
//                   onChange={(v) => onChange("phone", v)}
//                   placeholder="07XXXXXXXX"
//                 />
//                 <Field
//                   label="County"
//                   value={form.county}
//                   onChange={(v) => onChange("county", v)}
//                 />
//                 <Field
//                   label="Town"
//                   value={form.town}
//                   onChange={(v) => onChange("town", v)}
//                 />
//                 <Field
//                   label="Street"
//                   value={form.street}
//                   onChange={(v) => onChange("street", v)}
//                   placeholder="Street / Estate / Building"
//                 />

//                 <button
//                   type="submit"
//                   disabled={busy}
//                   className="mt-2 w-full rounded-2xl bg-gray-900 px-5 py-4 text-sm font-extrabold text-white hover:bg-black disabled:opacity-60"
//                 >
//                   {checkingOut
//                     ? "Placing Order..."
//                     : saving
//                     ? "Saving..."
//                     : editId != null
//                     ? "Update Address"
//                     : "Save Address & Place Order"}
//                 </button>

//                 {editId != null ? (
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     disabled={busy}
//                     className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-extrabold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
//                   >
//                     Cancel edit
//                   </button>
//                 ) : null}
//               </form>
//             </div>
//           </section>

//           {/* List */}
//           <section className="lg:col-span-2">
//             <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="mb-4 flex items-center justify-between gap-3">
//                 <div>
//                   <div className="text-sm font-extrabold text-gray-900">My Addresses</div>
//                   <div className="text-xs text-gray-600">
//                     Selecting one will place your order.
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => refetch()}
//                   disabled={busy}
//                   className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
//                 >
//                   Refresh
//                 </button>
//               </div>

//               {isLoading ? (
//                 <div className="space-y-3">
//                   {Array.from({ length: 3 }).map((_, i) => (
//                     <div key={i} className="animate-pulse rounded-3xl border border-gray-200 p-4">
//                       <div className="h-4 w-2/3 rounded bg-gray-200" />
//                       <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
//                       <div className="mt-4 h-9 w-full rounded bg-gray-200" />
//                     </div>
//                   ))}
//                 </div>
//               ) : isError ? (
//                 <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
//                   <div className="text-sm font-extrabold">Failed to load addresses.</div>
//                   <div className="mt-1 text-xs opacity-80">
//                     {(error as any)?.data?.detail || "Please try again."}
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => refetch()}
//                     className="mt-4 rounded-2xl bg-rose-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-rose-800"
//                     disabled={busy}
//                   >
//                     Retry
//                   </button>
//                 </div>
//               ) : !addresses?.length ? (
//                 <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-700">
//                   No saved addresses yet. Add one on the left to continue.
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {addresses.map((a) => (
//                     <div
//                       key={a.id}
//                       className="rounded-3xl border border-gray-200 bg-white p-4"
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <div className="text-sm font-extrabold text-gray-900">
//                             {a.full_name} • {a.phone}
//                           </div>
//                           <div className="mt-1 text-sm text-gray-700">
//                             {a.street}, {a.town}, {a.county}
//                           </div>
//                           <div className="mt-1 text-xs text-gray-500">
//                             Added:{" "}
//                             {a.created_at ? new Date(a.created_at).toLocaleString() : "—"}
//                           </div>
//                         </div>

//                         <div className="flex flex-col gap-2">
//                           <button
//                             type="button"
//                             onClick={() => startEdit(a)}
//                             disabled={busy}
//                             className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-extrabold text-gray-900 hover:bg-gray-100 disabled:opacity-60"
//                           >
//                             Edit
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => removeAddress(a.id)}
//                             disabled={busy}
//                             className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => chooseForCheckout(a)}
//                         disabled={busy}
//                         className="mt-4 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60"
//                       >
//                         {checkingOut ? "Placing order..." : "Use this address & Place Order →"}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

// /** --------- small input component --------- */
// function Field({
//   label,
//   value,
//   onChange,
//   placeholder,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
// }) {
//   return (
//     <label className="block">
//       <div className="mb-1 text-xs font-extrabold text-gray-700">{label}</div>
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
//       />
//     </label>
//   );
// }




// src/pages/AddressesPage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../../components/navbar/userNavbar";
import {
  useListMyAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  type AddressResponse,
  type AddressCreateInput,
} from "../../features/addresses/addressAPI";

// ✅ checkout mutation
import { useCheckoutOrderMutation } from "../../features/order/orderAPI";

// ✅ cart query (API cart)
import { useGetMyCartQuery } from "../../features/cart/cartAPI";

function kes(n: number) {
  return `KSh${Number(n || 0).toLocaleString()}.00`;
}

function isLoggedIn() {
  const token = localStorage.getItem("access_token");
  return Boolean(token && token.trim().length > 0);
}

export default function AddressesPage() {
  const navigate = useNavigate();


  const loggedIn = isLoggedIn();

  // ✅ Use API cart ONLY when logged in
  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartError,
  } = useGetMyCartQuery(undefined, { skip: !loggedIn });

  const cartCount = useMemo(() => {
    if (!loggedIn) return 0;
    const items = cartData?.items ?? [];
    return items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  }, [loggedIn, cartData]);

  const cartTotal = useMemo(() => {
    if (!loggedIn) return 0;
    const items = cartData?.items ?? [];
    return items.reduce((sum, it) => {
      const price = Number(it.product_price ?? 0);
      const qty = Number(it.quantity ?? 0);
      return sum + price * qty;
    }, 0);
  }, [loggedIn, cartData]);

  const { data: addresses, isLoading, isError, error, refetch } =
    useListMyAddressesQuery();

  const [createAddress, { isLoading: creating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: deleting }] = useDeleteAddressMutation();

  const [checkoutOrder, { isLoading: checkingOut }] = useCheckoutOrderMutation();

  const [form, setForm] = useState<AddressCreateInput>({
    full_name: "",
    phone: "",
    county: "",
    town: "",
    street: "",
  });

  const [editId, setEditId] = useState<number | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("");

  const saving = creating || updating;
  const busy = saving || deleting || checkingOut;

  const title = useMemo(() => {
    if (editId != null) return "Edit Address";
    return "Add New Address";
  }, [editId]);

  function showToast(msg: string) {
    setToastText(msg);
    setToastOpen(true);
    window.setTimeout(() => setToastOpen(false), 2500);
  }

  function onChange<K extends keyof AddressCreateInput>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function resetForm() {
    setForm({ full_name: "", phone: "", county: "", town: "", street: "" });
    setEditId(null);
  }

  function startEdit(a: AddressResponse) {
    setEditId(a.id);
    setForm({
      full_name: a.full_name ?? "",
      phone: a.phone ?? "",
      county: a.county ?? "",
      town: a.town ?? "",
      street: a.street ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function placeOrder(address_id: number) {
    try {
      showToast("Placing your order...");
      await checkoutOrder({ address_id }).unwrap();
      showToast("✅ Order placed successfully");

      // ✅ After order, go to Orders page
      navigate("/orders", { replace: true });

      // (optional) if you want order details:
      // const orderId = (createdOrder as any)?.id;
      // if (orderId) navigate(`/orders/${orderId}`, { replace: true });
    } catch (err: any) {
      if (String(err?.status) === "401") {
        navigate("/signin", { state: { from: "/addresses", next: "/addresses" } });
        return;
      }
      showToast(err?.data?.detail || "Checkout failed. Please try again.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const required: Array<keyof AddressCreateInput> = [
      "full_name",
      "phone",
      "county",
      "town",
      "street",
    ];
    for (const k of required) {
      if (!String(form[k] ?? "").trim()) {
        showToast(`Please fill ${k.replace("_", " ")}`);
        return;
      }
    }

    try {
      if (editId != null) {
        await updateAddress({ address_id: editId, body: form }).unwrap();
        showToast("✅ Address updated");
        resetForm();
        return;
      }

      const created = await createAddress(form).unwrap();
      showToast("✅ Address saved. Completing checkout...");
      resetForm();
      await placeOrder(created.id);
    } catch (err: any) {
      if (String(err?.status) === "401") {
        navigate("/signin", { state: { from: "/addresses", next: "/addresses" } });
        return;
      }
      showToast(err?.data?.detail || "Failed to save address");
    }
  }

  async function chooseForCheckout(a: AddressResponse) {
    await placeOrder(a.id);
  }

  async function removeAddress(id: number) {
    const ok = window.confirm("Delete this address?");
    if (!ok) return;

    try {
      await deleteAddress(id).unwrap();
      showToast("🗑️ Address deleted");
    } catch (err: any) {
      if (String(err?.status) === "401") {
        navigate("/signin", { state: { from: "/addresses", next: "/addresses" } });
        return;
      }
      showToast(err?.data?.detail || "Failed to delete address");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavBar
        logoSrc="/logo.png"
        searchValue=""
        onSearchChange={() => {}}
        // ✅ NOW navbar uses API cart when logged in (not local storage)
        cartCount={loggedIn && !cartLoading && !cartError ? cartCount : 0}
        cartTotalLabel={loggedIn && !cartLoading && !cartError ? kes(cartTotal) : "KSh0.00"}
        cartItems={loggedIn ? cartData?.items ?? [] : []}
        cartLoading={loggedIn ? cartLoading : false}
        cartError={loggedIn ? cartError : false}
        onCartClick={() => navigate("/cart")}
        wishlistCount={0}
      />

      {toastOpen ? (
        <div className="fixed bottom-5 right-5 z-50 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="text-sm font-extrabold text-gray-900">Notice</div>
          <div className="mt-1 text-xs text-gray-700">{toastText}</div>
        </div>
      ) : null}

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Delivery Address</h1>
            <p className="mt-1 text-sm text-gray-600">
              Add/select an address to complete checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50"
            disabled={busy}
          >
            ← Back
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <section className="lg:col-span-1">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <div className="text-sm font-extrabold text-gray-900">{title}</div>
                <div className="text-xs text-gray-600">
                  {editId != null
                    ? "Update your address details"
                    : "Save an address and we will place your order"}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <Field label="Full name" value={form.full_name} onChange={(v) => onChange("full_name", v)} />
                <Field label="Phone" value={form.phone} onChange={(v) => onChange("phone", v)} placeholder="07XXXXXXXX" />
                <Field label="County" value={form.county} onChange={(v) => onChange("county", v)} />
                <Field label="Town" value={form.town} onChange={(v) => onChange("town", v)} />
                <Field label="Street" value={form.street} onChange={(v) => onChange("street", v)} placeholder="Street / Estate / Building" />

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-2 w-full rounded-2xl bg-gray-900 px-5 py-4 text-sm font-extrabold text-white hover:bg-black disabled:opacity-60"
                >
                  {checkingOut
                    ? "Placing Order..."
                    : saving
                    ? "Saving..."
                    : editId != null
                    ? "Update Address"
                    : "Save Address & Place Order"}
                </button>

                {editId != null ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={busy}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-extrabold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                  >
                    Cancel edit
                  </button>
                ) : null}
              </form>
            </div>
          </section>

          {/* List */}
          <section className="lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-gray-900">My Addresses</div>
                  <div className="text-xs text-gray-600">Selecting one will place your order.</div>
                </div>

                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={busy}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                >
                  Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-3xl border border-gray-200 p-4">
                      <div className="h-4 w-2/3 rounded bg-gray-200" />
                      <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                      <div className="mt-4 h-9 w-full rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
                  <div className="text-sm font-extrabold">Failed to load addresses.</div>
                  <div className="mt-1 text-xs opacity-80">
                    {(error as any)?.data?.detail || "Please try again."}
                  </div>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-4 rounded-2xl bg-rose-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-rose-800"
                    disabled={busy}
                  >
                    Retry
                  </button>
                </div>
              ) : !addresses?.length ? (
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-700">
                  No saved addresses yet. Add one on the left to continue.
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <div key={a.id} className="rounded-3xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-extrabold text-gray-900">
                            {a.full_name} • {a.phone}
                          </div>
                          <div className="mt-1 text-sm text-gray-700">
                            {a.street}, {a.town}, {a.county}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Added: {a.created_at ? new Date(a.created_at).toLocaleString() : "—"}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(a)}
                            disabled={busy}
                            className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-extrabold text-gray-900 hover:bg-gray-100 disabled:opacity-60"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => removeAddress(a.id)}
                            disabled={busy}
                            className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => chooseForCheckout(a)}
                        disabled={busy}
                        className="mt-4 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {checkingOut ? "Placing order..." : "Use this address & Place Order →"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-extrabold text-gray-700">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300"
      />
    </label>
  );
}