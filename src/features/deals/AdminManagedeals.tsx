// // src/admin/AdminManageDeals.tsx
// import {  useMemo, useRef, useState } from "react";
// import {
//   useCreateDealMutation,
//   useDeleteDealMutation,
//   useListDealsQuery,
//   useUpdateDealMutation,
// } from "../../features/deals/dealsAPI";
// import type {
//   DealCreateInput,
//   DealItemInput,
//   DealResponse,
//   DealUpdateInput,
// } from "../../features/deals/dealsAPI";

// import { useListProductsQuery } from "../products/productsAPI";
// import type { ProductResponse } from "../products/productsAPI";

// type FormMode = "create" | "edit";

// type DealFormState = {
//   title: string;
//   description: string;
//   starts_at: string; // datetime-local value
//   ends_at: string; // datetime-local value
//   is_active: boolean;
// };

// type DealItemState = {
//   product_id: number;
//   deal_price: string;
//   discount_percentage: string;
//   sort_order: string;
// };

// const emptyForm = (): DealFormState => ({
//   title: "",
//   description: "",
//   starts_at: "",
//   ends_at: "",
//   is_active: true,
// });

// const toIsoOrNull = (dtLocal: string): string | null => {
//   if (!dtLocal.trim()) return null;
//   // dtLocal looks like "2026-02-27T14:30"
//   const d = new Date(dtLocal);
//   if (Number.isNaN(d.getTime())) return null;
//   return d.toISOString();
// };

// const fromIsoToLocal = (iso: string | null | undefined): string => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return "";
//   // convert to local datetime-local format (YYYY-MM-DDTHH:mm)
//   const pad = (n: number) => String(n).padStart(2, "0");
//   const yyyy = d.getFullYear();
//   const mm = pad(d.getMonth() + 1);
//   const dd = pad(d.getDate());
//   const hh = pad(d.getHours());
//   const mi = pad(d.getMinutes());
//   return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
// };

// const emptyItem = (product_id: number): DealItemState => ({
//   product_id,
//   deal_price: "",
//   discount_percentage: "",
//   sort_order: "",
// });

// const itemToApi = (i: DealItemState): DealItemInput => ({
//   product_id: i.product_id,
//   deal_price: i.deal_price.trim() ? Number(i.deal_price) : null,
//   discount_percentage: i.discount_percentage.trim()
//     ? Number(i.discount_percentage)
//     : null,
//   sort_order: i.sort_order.trim() ? Number(i.sort_order) : null,
// });

// const validateDeal = (s: DealFormState): string | null => {
//   if (!s.title.trim()) return "Title is required.";
//   if (s.starts_at && !toIsoOrNull(s.starts_at)) return "Invalid starts_at.";
//   if (s.ends_at && !toIsoOrNull(s.ends_at)) return "Invalid ends_at.";
//   if (s.starts_at && s.ends_at) {
//     const a = new Date(s.starts_at).getTime();
//     const b = new Date(s.ends_at).getTime();
//     if (!Number.isNaN(a) && !Number.isNaN(b) && b <= a)
//       return "Ends time must be after start time.";
//   }
//   return null;
// };

// const validateItem = (i: DealItemState): string | null => {
//   const dp = i.deal_price.trim() ? Number(i.deal_price) : null;
//   const disc = i.discount_percentage.trim()
//     ? Number(i.discount_percentage)
//     : null;
//   const so = i.sort_order.trim() ? Number(i.sort_order) : null;

//   if (dp != null && Number.isNaN(dp)) return "Deal price must be a number.";
//   if (disc != null && Number.isNaN(disc))
//     return "Discount percentage must be a number.";
//   if (so != null && Number.isNaN(so)) return "Sort order must be a number.";
//   if (dp != null && dp < 0) return "Deal price cannot be negative.";
//   if (disc != null && (disc < 0 || disc > 100))
//     return "Discount must be between 0 and 100.";
//   return null;
// };

// export default function AdminManageDeals() {
//   const { data, isLoading, isFetching, error, refetch } = useListDealsQuery();
//   const {
//     data: products,
//     isLoading: productsLoading,
//     isFetching: productsFetching,
//     error: productsError,
//   } = useListProductsQuery();

//   const [createDeal, createMeta] = useCreateDealMutation();
//   const [updateDeal, updateMeta] = useUpdateDealMutation();
//   const [deleteDeal, deleteMeta] = useDeleteDealMutation();

//   const [query, setQuery] = useState("");
//   const [toast, setToast] = useState<string | null>(null);

//   const [mode, setMode] = useState<FormMode>("create");
//   const [editing, setEditing] = useState<DealResponse | null>(null);
//   const [form, setForm] = useState<DealFormState>(emptyForm());

//   const [itemSearch, setItemSearch] = useState("");
//   const [selectedProductId, setSelectedProductId] = useState<string>("");
//   const [items, setItems] = useState<DealItemState[]>([]);

//   const formCardRef = useRef<HTMLDivElement | null>(null);

//   const busy =
//     isLoading ||
//     isFetching ||
//     productsLoading ||
//     productsFetching ||
//     createMeta.isLoading ||
//     updateMeta.isLoading ||
//     deleteMeta.isLoading;

//   const showToast = (msg: string) => {
//     setToast(msg);
//     window.setTimeout(() => setToast(null), 2600);
//   };

//   const onChange = (key: keyof DealFormState, value: string | boolean) => {
//     setForm((prev) => ({ ...prev, [key]: value } as DealFormState));
//   };

//   const resetToCreate = () => {
//     setMode("create");
//     setEditing(null);
//     setForm(emptyForm());
//     setItems([]);
//     setSelectedProductId("");
//     setItemSearch("");
//   };

//   const openEdit = (d: DealResponse) => {
//     setMode("edit");
//     setEditing(d);

//     setForm({
//       title: d.title ?? "",
//       description: d.description ?? "",
//       starts_at: fromIsoToLocal(d.starts_at),
//       ends_at: fromIsoToLocal(d.ends_at),
//       is_active: !!d.is_active,
//     });

//     const mapped: DealItemState[] = (d.products ?? []).map((p) => ({
//       product_id: p.id,
//       deal_price: p.deal_price == null ? "" : String(p.deal_price),
//       discount_percentage:
//         p.discount_percentage == null ? "" : String(p.discount_percentage),
//       sort_order: p.sort_order == null ? "" : String(p.sort_order),
//     }));
//     setItems(mapped);

//     window.setTimeout(() => {
//       formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 50);
//   };

//   const filteredDeals = useMemo(() => {
//     const list = data ?? [];
//     const q = query.trim().toLowerCase();
//     if (!q) return list;
//     return list.filter((d) => {
//       const t = d.title?.toLowerCase() ?? "";
//       const desc = d.description?.toLowerCase() ?? "";
//       return t.includes(q) || desc.includes(q);
//     });
//   }, [data, query]);

//   const productOptions = useMemo(() => {
//     const list = (products ?? []) as ProductResponse[];
//     const q = itemSearch.trim().toLowerCase();
//     if (!q) return list.slice(0, 100);
//     return list
//       .filter((p) => {
//         const name = p.name?.toLowerCase() ?? "";
//         const cat = p.category?.name?.toLowerCase() ?? "";
//         return name.includes(q) || cat.includes(q);
//       })
//       .slice(0, 100);
//   }, [products, itemSearch]);

//   const itemsById = useMemo(() => {
//     const map = new Map<number, DealItemState>();
//     for (const it of items) map.set(it.product_id, it);
//     return map;
//   }, [items]);

//   const addItem = () => {
//     const pid = Number(selectedProductId);
//     if (!pid || Number.isNaN(pid)) {
//       showToast("Pick a product to add.");
//       return;
//     }
//     if (itemsById.has(pid)) {
//       showToast("That product is already in this deal.");
//       return;
//     }
//     setItems((prev) => [...prev, emptyItem(pid)]);
//     setSelectedProductId("");
//     showToast("Added product to deal.");
//   };

//   const removeItem = (product_id: number) => {
//     setItems((prev) => prev.filter((x) => x.product_id !== product_id));
//   };

//   const updateItem = (
//     product_id: number,
//     key: keyof Omit<DealItemState, "product_id">,
//     value: string
//   ) => {
//     setItems((prev) =>
//       prev.map((x) => (x.product_id === product_id ? { ...x, [key]: value } : x))
//     );
//   };

//   const submit = async () => {
//     const err = validateDeal(form);
//     if (err) {
//       showToast(err);
//       return;
//     }

//     for (const it of items) {
//       const e = validateItem(it);
//       if (e) {
//         const pName =
//           (products ?? []).find((p) => p.id === it.product_id)?.name ??
//           `#${it.product_id}`;
//         showToast(`${e} (Product: ${pName})`);
//         return;
//       }
//     }

//     const payloadBase = {
//       title: form.title.trim(),
//       description: form.description.trim() ? form.description.trim() : null,
//       starts_at: toIsoOrNull(form.starts_at),
//       ends_at: toIsoOrNull(form.ends_at),
//       is_active: form.is_active,
//       items: items.map(itemToApi),
//     };

//     try {
//       if (mode === "create") {
//         const body: DealCreateInput = payloadBase;
//         await createDeal(body).unwrap();
//         showToast("Deal created.");
//         resetToCreate();
//       } else {
//         if (!editing) return;
//         const body: DealUpdateInput = payloadBase;
//         await updateDeal({ deal_id: editing.id, body }).unwrap();
//         showToast("Deal updated.");
//         resetToCreate();
//       }
//     } catch (e: any) {
//       const msg =
//         e?.data?.detail ||
//         e?.error ||
//         e?.message ||
//         "Something went wrong. Check your API and token.";
//       showToast(String(msg));
//     }
//   };

//   const onDelete = async (d: DealResponse) => {
//     const ok = window.confirm(`Delete deal "${d.title}"? This can't be undone.`);
//     if (!ok) return;

//     try {
//       await deleteDeal(d.id).unwrap();
//       showToast("Deal deleted.");
//       if (editing?.id === d.id) resetToCreate();
//     } catch (e: any) {
//       const msg =
//         e?.data?.detail ||
//         e?.error ||
//         e?.message ||
//         "Failed to delete. Check your API and token.";
//       showToast(String(msg));
//     }
//   };

//   const fmt = (iso?: string | null) => {
//     if (!iso) return "—";
//     const d = new Date(iso);
//     if (Number.isNaN(d.getTime())) return "—";
//     return d.toLocaleString();
//   };

//   const dealStatusPill = (d: DealResponse) => {
//     const now = Date.now();
//     const starts = d.starts_at ? new Date(d.starts_at).getTime() : null;
//     const ends = d.ends_at ? new Date(d.ends_at).getTime() : null;

//     const active = d.is_active;
//     const within =
//       (starts == null || now >= starts) && (ends == null || now <= ends);

//     if (!active) {
//       return (
//         <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//           Inactive
//         </span>
//       );
//     }

//     if (within) {
//       return (
//         <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
//           Active
//         </span>
//       );
//     }

//     return (
//       <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700">
//         Scheduled/Ended
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-fuchsia-100/50 via-pink-100/30 to-transparent" />

//       <div className="mx-auto w-full max-w-6xl px-4 py-6">
//         {/* Header */}
//         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h2 className="text-xl font-extrabold tracking-tight">
//               Admin · Deals
//             </h2>
//             <p className="mt-1 text-sm text-slate-600">
//               Create deals and attach products with deal pricing or discounts.
//             </p>
//           </div>

//           <button
//             onClick={() => refetch()}
//             disabled={busy}
//             className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
//           >
//             {isFetching ? "Refreshing…" : "Refresh"}
//           </button>
//         </div>

//         {/* Toast */}
//         {toast && (
//           <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm">
//             <div>{toast}</div>
//             <button
//               className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50"
//               onClick={() => setToast(null)}
//             >
//               Dismiss
//             </button>
//           </div>
//         )}

//         <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
//           {/* Form */}
//           <div
//             ref={formCardRef}
//             className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm"
//           >
//             <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
//               <h3 className="text-sm font-extrabold">
//                 {mode === "create"
//                   ? "Create deal"
//                   : `Edit deal #${editing?.id}`}
//               </h3>

//               {mode === "edit" ? (
//                 <button
//                   onClick={resetToCreate}
//                   disabled={busy}
//                   className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50 disabled:opacity-60"
//                 >
//                   Cancel
//                 </button>
//               ) : (
//                 <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                   Required: title
//                 </span>
//               )}
//             </div>

//             <div className="p-4">
//               <div className="grid gap-3">
//                 {/* Title */}
//                 <label className="grid gap-1.5">
//                   <span className="text-xs font-bold text-slate-700">
//                     Title *
//                   </span>
//                   <input
//                     value={form.title}
//                     onChange={(e) => onChange("title", e.target.value)}
//                     placeholder="e.g. Weekend Flash Sale"
//                     className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                   />
//                 </label>

//                 {/* Description */}
//                 <label className="grid gap-1.5">
//                   <span className="text-xs font-bold text-slate-700">
//                     Description
//                   </span>
//                   <textarea
//                     value={form.description}
//                     onChange={(e) => onChange("description", e.target.value)}
//                     placeholder="Optional"
//                     rows={3}
//                     className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                   />
//                 </label>

//                 {/* Dates */}
//                 <div className="grid gap-3 sm:grid-cols-2">
//                   <label className="grid gap-1.5">
//                     <span className="text-xs font-bold text-slate-700">
//                       Starts at
//                     </span>
//                     <input
//                       type="datetime-local"
//                       value={form.starts_at}
//                       onChange={(e) => onChange("starts_at", e.target.value)}
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                     />
//                   </label>

//                   <label className="grid gap-1.5">
//                     <span className="text-xs font-bold text-slate-700">
//                       Ends at
//                     </span>
//                     <input
//                       type="datetime-local"
//                       value={form.ends_at}
//                       onChange={(e) => onChange("ends_at", e.target.value)}
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                     />
//                   </label>
//                 </div>

//                 {/* Active */}
//                 <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
//                   <input
//                     type="checkbox"
//                     checked={form.is_active}
//                     onChange={(e) => onChange("is_active", e.target.checked)}
//                     className="h-4 w-4 accent-fuchsia-600"
//                   />
//                   <span className="text-sm font-bold text-slate-700">
//                     Is active
//                   </span>
//                 </label>

//                 {/* Items builder */}
//                 <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
//                   <div className="flex flex-wrap items-center justify-between gap-2">
//                     <div className="text-sm font-extrabold text-slate-900">
//                       Deal products
//                     </div>

//                     <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                       {items.length} item(s)
//                     </span>
//                   </div>

//                   <div className="mt-3 grid gap-2">
//                     <input
//                       value={itemSearch}
//                       onChange={(e) => setItemSearch(e.target.value)}
//                       placeholder="Search products to add…"
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                     />

//                     <div className="flex flex-wrap gap-2">
//                       <select
//                         value={selectedProductId}
//                         onChange={(e) => setSelectedProductId(e.target.value)}
//                         className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                       >
//                         <option value="">Select a product…</option>
//                         {productOptions.map((p) => (
//                           <option key={p.id} value={String(p.id)}>
//                             {p.name} — {p.category?.name ?? "No category"}
//                           </option>
//                         ))}
//                       </select>

//                       <button
//                         type="button"
//                         onClick={addItem}
//                         disabled={busy}
//                         className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
//                       >
//                         Add
//                       </button>
//                     </div>

//                     {productsError && (
//                       <div className="text-xs font-bold text-red-600">
//                         Failed to load products list (needed for adding deal
//                         items).
//                       </div>
//                     )}
//                   </div>

//                   {/* Items list */}
//                   {items.length > 0 && (
//                     <div className="mt-3 grid gap-3">
//                       {items.map((it) => {
//                         const p =
//                           (products ?? []).find((x) => x.id === it.product_id) ??
//                           null;
//                         return (
//                           <div
//                             key={it.product_id}
//                             className="rounded-2xl border border-slate-200 bg-white p-3"
//                           >
//                             <div className="flex flex-wrap items-start justify-between gap-2">
//                               <div className="min-w-[220px]">
//                                 <div className="text-sm font-extrabold text-slate-900">
//                                   {p?.name ?? `Product #${it.product_id}`}
//                                 </div>
//                                 <div className="mt-0.5 text-xs text-slate-500">
//                                   Base price: {p?.price ?? "—"} • Stock:{" "}
//                                   {p?.stock ?? "—"} • Category:{" "}
//                                   {p?.category?.name ?? "—"}
//                                 </div>
//                               </div>

//                               <button
//                                 type="button"
//                                 onClick={() => removeItem(it.product_id)}
//                                 disabled={busy}
//                                 className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
//                               >
//                                 Remove
//                               </button>
//                             </div>

//                             <div className="mt-3 grid gap-3 sm:grid-cols-3">
//                               <label className="grid gap-1.5">
//                                 <span className="text-xs font-bold text-slate-700">
//                                   Deal price
//                                 </span>
//                                 <input
//                                   value={it.deal_price}
//                                   onChange={(e) =>
//                                     updateItem(
//                                       it.product_id,
//                                       "deal_price",
//                                       e.target.value
//                                     )
//                                   }
//                                   placeholder="Optional"
//                                   inputMode="decimal"
//                                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                                 />
//                               </label>

//                               <label className="grid gap-1.5">
//                                 <span className="text-xs font-bold text-slate-700">
//                                   Discount %
//                                 </span>
//                                 <input
//                                   value={it.discount_percentage}
//                                   onChange={(e) =>
//                                     updateItem(
//                                       it.product_id,
//                                       "discount_percentage",
//                                       e.target.value
//                                     )
//                                   }
//                                   placeholder="Optional"
//                                   inputMode="decimal"
//                                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                                 />
//                               </label>

//                               <label className="grid gap-1.5">
//                                 <span className="text-xs font-bold text-slate-700">
//                                   Sort order
//                                 </span>
//                                 <input
//                                   value={it.sort_order}
//                                   onChange={(e) =>
//                                     updateItem(
//                                       it.product_id,
//                                       "sort_order",
//                                       e.target.value
//                                     )
//                                   }
//                                   placeholder="Optional"
//                                   inputMode="numeric"
//                                   className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//                                 />
//                               </label>
//                             </div>

//                             <p className="mt-2 text-[11px] text-slate-500">
//                               Tip: set <b>either</b> deal price or discount (or
//                               both). Your backend decides how to apply it.
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   onClick={submit}
//                   disabled={busy}
//                   className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-fuchsia-600 to-fuchsia-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-fuchsia-700 hover:to-fuchsia-800 disabled:opacity-60"
//                 >
//                   {mode === "create"
//                     ? createMeta.isLoading
//                       ? "Creating…"
//                       : "Create deal"
//                     : updateMeta.isLoading
//                     ? "Saving…"
//                     : "Save changes"}
//                 </button>

//                 {createMeta.isError && (
//                   <div className="text-sm font-bold text-red-600">
//                     Create failed. Check console/network.
//                   </div>
//                 )}
//                 {updateMeta.isError && (
//                   <div className="text-sm font-bold text-red-600">
//                     Update failed. Check console/network.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Deals list */}
//           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
//             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
//               <h3 className="text-sm font-extrabold">Deals</h3>
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search title / description…"
//                 className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
//               />
//             </div>

//             <div className="p-4">
//               {error && (
//                 <div className="text-sm font-bold text-red-600">
//                   Failed to load deals. Check API base URL and token.
//                 </div>
//               )}
//               {isLoading && (
//                 <p className="text-sm text-slate-600">Loading deals…</p>
//               )}

//               {/* Desktop table */}
//               <div className="hidden overflow-x-auto lg:block">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
//                       {["Title", "Window", "Active", "Items", "Created", "Actions"].map(
//                         (h) => (
//                           <th
//                             key={h}
//                             className="whitespace-nowrap border-b border-slate-100 px-2 py-3"
//                           >
//                             {h}
//                           </th>
//                         )
//                       )}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredDeals.map((d) => (
//                       <tr key={d.id} className="border-b border-slate-50">
//                         <td className="px-2 py-3">
//                           <div className="font-extrabold">{d.title}</div>
//                           <div className="mt-0.5 text-xs text-slate-500">
//                             #{d.id} • {d.description ? d.description.slice(0, 44) : "No description"}
//                             {d.description && d.description.length > 44 ? "…" : ""}
//                           </div>
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-600">
//                           <div>Start: {fmt(d.starts_at)}</div>
//                           <div>End: {fmt(d.ends_at)}</div>
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3">
//                           {dealStatusPill(d)}
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3">
//                           <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                             {(d.products ?? []).length}
//                           </span>
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
//                           {new Date(d.created_at).toLocaleString()}
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3">
//                           <div className="flex flex-wrap gap-2">
//                             <button
//                               onClick={() => openEdit(d)}
//                               disabled={busy}
//                               className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => onDelete(d)}
//                               disabled={busy}
//                               className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
//                             >
//                               {deleteMeta.isLoading ? "Deleting…" : "Delete"}
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}

//                     {!isLoading && filteredDeals.length === 0 && (
//                       <tr>
//                         <td colSpan={6} className="px-2 py-4 text-sm text-slate-500">
//                           No deals found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile cards */}
//               <div className="grid gap-3 lg:hidden">
//                 {filteredDeals.map((d) => (
//                   <div
//                     key={d.id}
//                     className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <div className="text-sm font-extrabold">{d.title}</div>
//                         <div className="mt-0.5 text-xs text-slate-500">
//                           #{d.id} • {(d.products ?? []).length} item(s)
//                         </div>
//                       </div>
//                       {dealStatusPill(d)}
//                     </div>

//                     <div className="mt-2 text-xs text-slate-600">
//                       {d.description ? d.description : "No description"}
//                     </div>

//                     <div className="mt-2 text-xs text-slate-500">
//                       <div>Start: {fmt(d.starts_at)}</div>
//                       <div>End: {fmt(d.ends_at)}</div>
//                       <div>Created: {new Date(d.created_at).toLocaleString()}</div>
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <button
//                         onClick={() => openEdit(d)}
//                         disabled={busy}
//                         className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => onDelete(d)}
//                         disabled={busy}
//                         className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
//                       >
//                         {deleteMeta.isLoading ? "Deleting…" : "Delete"}
//                       </button>
//                     </div>
//                   </div>
//                 ))}

//                 {!isLoading && filteredDeals.length === 0 && (
//                   <div className="text-sm text-slate-500">No deals found.</div>
//                 )}
//               </div>

//               <div className="mt-3 text-xs text-slate-500">
//                 {busy ? "Working…" : `Showing ${filteredDeals.length} deal(s).`}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






// src/admin/AdminManageDeals.tsx
import { useMemo, useRef, useState } from "react";
import {
  useCreateDealMutation,
  useDeleteDealMutation,
  useListDealsQuery,
  useUpdateDealMutation,
} from "../../features/deals/dealsAPI";
import type {
  DealCreateInput,
  DealItemInput,
  DealResponse,
  DealUpdateInput,
} from "../../features/deals/dealsAPI";

import { useListProductsQuery } from "../products/productsAPI";
import type { ProductResponse } from "../products/productsAPI";

type FormMode = "create" | "edit";

type DealFormState = {
  title: string;
  description: string;
  starts_at: string; // datetime-local value
  ends_at: string; // datetime-local value
  is_active: boolean;
};

type DealItemState = {
  product_id: number;
  deal_price: string;
  discount_percentage: string;
  sort_order: string;
};

const emptyForm = (): DealFormState => ({
  title: "",
  description: "",
  starts_at: "",
  ends_at: "",
  is_active: true,
});

const toIsoOrNull = (dtLocal: string): string | null => {
  if (!dtLocal.trim()) return null;
  const d = new Date(dtLocal);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const fromIsoToLocal = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

const emptyItem = (product_id: number): DealItemState => ({
  product_id,
  deal_price: "",
  discount_percentage: "",
  sort_order: "",
});

/**
 * ✅ IMPORTANT FIX:
 * Don't send sort_order: null (FastAPI expects int, not null).
 * Only include optional fields when they have values.
 */
const itemToApi = (i: DealItemState): DealItemInput => {
  const out: DealItemInput = { product_id: i.product_id };

  if (i.deal_price.trim()) out.deal_price = Number(i.deal_price);
  if (i.discount_percentage.trim())
    out.discount_percentage = Number(i.discount_percentage);
  if (i.sort_order.trim()) out.sort_order = Number(i.sort_order);

  return out;
};

const validateDeal = (s: DealFormState): string | null => {
  if (!s.title.trim()) return "Title is required.";
  if (s.starts_at && !toIsoOrNull(s.starts_at)) return "Invalid starts_at.";
  if (s.ends_at && !toIsoOrNull(s.ends_at)) return "Invalid ends_at.";
  if (s.starts_at && s.ends_at) {
    const a = new Date(s.starts_at).getTime();
    const b = new Date(s.ends_at).getTime();
    if (!Number.isNaN(a) && !Number.isNaN(b) && b <= a)
      return "Ends time must be after start time.";
  }
  return null;
};

const validateItem = (i: DealItemState): string | null => {
  const dp = i.deal_price.trim() ? Number(i.deal_price) : null;
  const disc = i.discount_percentage.trim()
    ? Number(i.discount_percentage)
    : null;
  const so = i.sort_order.trim() ? Number(i.sort_order) : null;

  if (dp != null && Number.isNaN(dp)) return "Deal price must be a number.";
  if (disc != null && Number.isNaN(disc))
    return "Discount percentage must be a number.";
  if (so != null && Number.isNaN(so)) return "Sort order must be a number.";
  if (dp != null && dp < 0) return "Deal price cannot be negative.";
  if (disc != null && (disc < 0 || disc > 100))
    return "Discount must be between 0 and 100.";
  if (so != null && so < 0) return "Sort order cannot be negative.";
  return null;
};

export default function AdminManageDeals() {
  const { data, isLoading, isFetching, error, refetch } = useListDealsQuery();
  const {
    data: products,
    isLoading: productsLoading,
    isFetching: productsFetching,
    error: productsError,
  } = useListProductsQuery();

  const [createDeal, createMeta] = useCreateDealMutation();
  const [updateDeal, updateMeta] = useUpdateDealMutation();
  const [deleteDeal, deleteMeta] = useDeleteDealMutation();

  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [mode, setMode] = useState<FormMode>("create");
  const [editing, setEditing] = useState<DealResponse | null>(null);
  const [form, setForm] = useState<DealFormState>(emptyForm());

  const [itemSearch, setItemSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [items, setItems] = useState<DealItemState[]>([]);

  const formCardRef = useRef<HTMLDivElement | null>(null);

  const busy =
    isLoading ||
    isFetching ||
    productsLoading ||
    productsFetching ||
    createMeta.isLoading ||
    updateMeta.isLoading ||
    deleteMeta.isLoading;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const onChange = (key: keyof DealFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value } as DealFormState));
  };

  const resetToCreate = () => {
    setMode("create");
    setEditing(null);
    setForm(emptyForm());
    setItems([]);
    setSelectedProductId("");
    setItemSearch("");
  };

  const openEdit = (d: DealResponse) => {
    setMode("edit");
    setEditing(d);

    setForm({
      title: d.title ?? "",
      description: d.description ?? "",
      starts_at: fromIsoToLocal(d.starts_at),
      ends_at: fromIsoToLocal(d.ends_at),
      is_active: !!d.is_active,
    });

    const mapped: DealItemState[] = (d.products ?? []).map((p) => ({
      product_id: p.id,
      deal_price: p.deal_price == null ? "" : String(p.deal_price),
      discount_percentage:
        p.discount_percentage == null ? "" : String(p.discount_percentage),
      sort_order: p.sort_order == null ? "" : String(p.sort_order),
    }));
    setItems(mapped);

    window.setTimeout(() => {
      formCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const filteredDeals = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((d) => {
      const t = d.title?.toLowerCase() ?? "";
      const desc = d.description?.toLowerCase() ?? "";
      return t.includes(q) || desc.includes(q);
    });
  }, [data, query]);

  const productOptions = useMemo(() => {
    const list = (products ?? []) as ProductResponse[];
    const q = itemSearch.trim().toLowerCase();
    if (!q) return list.slice(0, 100);
    return list
      .filter((p) => {
        const name = p.name?.toLowerCase() ?? "";
        const cat = p.category?.name?.toLowerCase() ?? "";
        return name.includes(q) || cat.includes(q);
      })
      .slice(0, 100);
  }, [products, itemSearch]);

  const itemsById = useMemo(() => {
    const map = new Map<number, DealItemState>();
    for (const it of items) map.set(it.product_id, it);
    return map;
  }, [items]);

  const addItem = () => {
    const pid = Number(selectedProductId);
    if (!pid || Number.isNaN(pid)) {
      showToast("Pick a product to add.");
      return;
    }
    if (itemsById.has(pid)) {
      showToast("That product is already in this deal.");
      return;
    }
    setItems((prev) => [...prev, emptyItem(pid)]);
    setSelectedProductId("");
    showToast("Added product to deal.");
  };

  const removeItem = (product_id: number) => {
    setItems((prev) => prev.filter((x) => x.product_id !== product_id));
  };

  const updateItem = (
    product_id: number,
    key: keyof Omit<DealItemState, "product_id">,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((x) => (x.product_id === product_id ? { ...x, [key]: value } : x))
    );
  };

  const submit = async () => {
    const err = validateDeal(form);
    if (err) {
      showToast(err);
      return;
    }

    for (const it of items) {
      const e = validateItem(it);
      if (e) {
        const pName =
          (products ?? []).find((p) => p.id === it.product_id)?.name ??
          `#${it.product_id}`;
        showToast(`${e} (Product: ${pName})`);
        return;
      }
    }

    const payloadBase = {
      title: form.title.trim(),
      description: form.description.trim() ? form.description.trim() : null,
      starts_at: toIsoOrNull(form.starts_at),
      ends_at: toIsoOrNull(form.ends_at),
      is_active: form.is_active,
      items: items.map(itemToApi),
    };

    try {
      if (mode === "create") {
        const body: DealCreateInput = payloadBase;
        await createDeal(body).unwrap();
        showToast("Deal created.");
        resetToCreate();
      } else {
        if (!editing) return;
        const body: DealUpdateInput = payloadBase;
        await updateDeal({ deal_id: editing.id, body }).unwrap();
        showToast("Deal updated.");
        resetToCreate();
      }
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.error ||
        e?.message ||
        "Something went wrong. Check your API and token.";
      showToast(String(msg));
    }
  };

  const onDelete = async (d: DealResponse) => {
    const ok = window.confirm(`Delete deal "${d.title}"? This can't be undone.`);
    if (!ok) return;

    try {
      await deleteDeal(d.id).unwrap();
      showToast("Deal deleted.");
      if (editing?.id === d.id) resetToCreate();
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.error ||
        e?.message ||
        "Failed to delete. Check your API and token.";
      showToast(String(msg));
    }
  };

  const fmt = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  const dealStatusPill = (d: DealResponse) => {
    const now = Date.now();
    const starts = d.starts_at ? new Date(d.starts_at).getTime() : null;
    const ends = d.ends_at ? new Date(d.ends_at).getTime() : null;

    const active = d.is_active;
    const within =
      (starts == null || now >= starts) && (ends == null || now <= ends);

    if (!active) {
      return (
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
          Inactive
        </span>
      );
    }

    if (within) {
      return (
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
          Active
        </span>
      );
    }

    return (
      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700">
        Scheduled/Ended
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-fuchsia-100/50 via-pink-100/30 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Admin · Deals
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Create deals and attach products with deal pricing or discounts.
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

        <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
          {/* Form */}
          <div
            ref={formCardRef}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-extrabold">
                {mode === "create"
                  ? "Create deal"
                  : `Edit deal #${editing?.id}`}
              </h3>

              {mode === "edit" ? (
                <button
                  onClick={resetToCreate}
                  disabled={busy}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              ) : (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                  Required: title
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="grid gap-3">
                {/* Title */}
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    Title *
                  </span>
                  <input
                    value={form.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    placeholder="e.g. Weekend Flash Sale"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                  />
                </label>

                {/* Description */}
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    Description
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Optional"
                    rows={3}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                  />
                </label>

                {/* Dates */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Starts at
                    </span>
                    <input
                      type="datetime-local"
                      value={form.starts_at}
                      onChange={(e) => onChange("starts_at", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Ends at
                    </span>
                    <input
                      type="datetime-local"
                      value={form.ends_at}
                      onChange={(e) => onChange("ends_at", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                    />
                  </label>
                </div>

                {/* Active */}
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => onChange("is_active", e.target.checked)}
                    className="h-4 w-4 accent-fuchsia-600"
                  />
                  <span className="text-sm font-bold text-slate-700">
                    Is active
                  </span>
                </label>

                {/* Items builder */}
                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-extrabold text-slate-900">
                      Deal products
                    </div>

                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-extrabold text-slate-700">
                      {items.length} item(s)
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <input
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                      placeholder="Search products to add…"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                    />

                    <div className="flex flex-wrap gap-2">
                      <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                      >
                        <option value="">Select a product…</option>
                        {productOptions.map((p) => (
                          <option key={p.id} value={String(p.id)}>
                            {p.name} — {p.category?.name ?? "No category"}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={addItem}
                        disabled={busy}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        Add
                      </button>
                    </div>

                    {(productsError as any) && (
                      <div className="text-xs font-bold text-red-600">
                        Failed to load products list (needed for adding deal
                        items).
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  {items.length > 0 && (
                    <div className="mt-3 grid gap-3">
                      {items.map((it) => {
                        const p =
                          (products ?? []).find((x) => x.id === it.product_id) ??
                          null;
                        return (
                          <div
                            key={it.product_id}
                            className="rounded-2xl border border-slate-200 bg-white p-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-[220px]">
                                <div className="text-sm font-extrabold text-slate-900">
                                  {p?.name ?? `Product #${it.product_id}`}
                                </div>
                                <div className="mt-0.5 text-xs text-slate-500">
                                  Base price: {p?.price ?? "—"} • Stock:{" "}
                                  {p?.stock ?? "—"} • Category:{" "}
                                  {p?.category?.name ?? "—"}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(it.product_id)}
                                disabled={busy}
                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                              <label className="grid gap-1.5">
                                <span className="text-xs font-bold text-slate-700">
                                  Deal price
                                </span>
                                <input
                                  value={it.deal_price}
                                  onChange={(e) =>
                                    updateItem(
                                      it.product_id,
                                      "deal_price",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Optional"
                                  inputMode="decimal"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                                />
                              </label>

                              <label className="grid gap-1.5">
                                <span className="text-xs font-bold text-slate-700">
                                  Discount %
                                </span>
                                <input
                                  value={it.discount_percentage}
                                  onChange={(e) =>
                                    updateItem(
                                      it.product_id,
                                      "discount_percentage",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Optional"
                                  inputMode="decimal"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                                />
                              </label>

                              <label className="grid gap-1.5">
                                <span className="text-xs font-bold text-slate-700">
                                  Sort order
                                </span>
                                <input
                                  value={it.sort_order}
                                  onChange={(e) =>
                                    updateItem(
                                      it.product_id,
                                      "sort_order",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Optional"
                                  inputMode="numeric"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
                                />
                              </label>
                            </div>

                            <p className="mt-2 text-[11px] text-slate-500">
                              Tip: set <b>either</b> deal price or discount (or
                              both). Your backend decides how to apply it.
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={submit}
                  disabled={busy}
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-fuchsia-600 to-fuchsia-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-fuchsia-700 hover:to-fuchsia-800 disabled:opacity-60"
                >
                  {mode === "create"
                    ? createMeta.isLoading
                      ? "Creating…"
                      : "Create deal"
                    : updateMeta.isLoading
                    ? "Saving…"
                    : "Save changes"}
                </button>

                {createMeta.isError && (
                  <div className="text-sm font-bold text-red-600">
                    Create failed. Check console/network.
                  </div>
                )}
                {updateMeta.isError && (
                  <div className="text-sm font-bold text-red-600">
                    Update failed. Check console/network.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deals list */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-extrabold">Deals</h3>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title / description…"
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100"
              />
            </div>

            <div className="p-4">
              {error && (
                <div className="text-sm font-bold text-red-600">
                  Failed to load deals. Check API base URL and token.
                </div>
              )}
              {isLoading && (
                <p className="text-sm text-slate-600">Loading deals…</p>
              )}

              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {["Title", "Window", "Active", "Items", "Created", "Actions"].map(
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
                    {filteredDeals.map((d) => (
                      <tr key={d.id} className="border-b border-slate-50">
                        <td className="px-2 py-3">
                          <div className="font-extrabold">{d.title}</div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            #{d.id} •{" "}
                            {d.description ? d.description.slice(0, 44) : "No description"}
                            {d.description && d.description.length > 44 ? "…" : ""}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-600">
                          <div>Start: {fmt(d.starts_at)}</div>
                          <div>End: {fmt(d.ends_at)}</div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          {dealStatusPill(d)}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                            {(d.products ?? []).length}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
                          {new Date(d.created_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openEdit(d)}
                              disabled={busy}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(d)}
                              disabled={busy}
                              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                            >
                              {deleteMeta.isLoading ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!isLoading && filteredDeals.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-2 py-4 text-sm text-slate-500">
                          No deals found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 lg:hidden">
                {filteredDeals.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold">{d.title}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          #{d.id} • {(d.products ?? []).length} item(s)
                        </div>
                      </div>
                      {dealStatusPill(d)}
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      {d.description ? d.description : "No description"}
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      <div>Start: {fmt(d.starts_at)}</div>
                      <div>End: {fmt(d.ends_at)}</div>
                      <div>Created: {new Date(d.created_at).toLocaleString()}</div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => openEdit(d)}
                        disabled={busy}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(d)}
                        disabled={busy}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                      >
                        {deleteMeta.isLoading ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}

                {!isLoading && filteredDeals.length === 0 && (
                  <div className="text-sm text-slate-500">No deals found.</div>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-500">
                {busy ? "Working…" : `Showing ${filteredDeals.length} deal(s).`}
              </div>
            </div>
          </div>
        </div>

        {(productsLoading || productsFetching) && (
          <div className="mt-4 text-xs text-slate-500">
            Loading products for deal items…
          </div>
        )}
      </div>
    </div>
  );
}