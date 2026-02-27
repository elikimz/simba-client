// // src/admin/AdminProduct.tsx
// import { useMemo, useRef, useState } from "react";
// import {
//   useCreateProductMutation,
//   useDeleteProductMutation,
//   useListProductsQuery,
//   useUpdateProductMutation,
// } from "../products/productsAPI";
// import type {
//   ProductCreateInput,
//   ProductResponse,
//   ProductUpdateInput,
// } from "../products/productsAPI";

// type FormMode = "create" | "edit";

// type ProductFormState = {
//   name: string;
//   description: string;
//   price: string;
//   original_price: string;
//   discount_percentage: string;
//   stock: string;
//   image_url: string;
//   category_id: string;
// };

// const emptyForm = (): ProductFormState => ({
//   name: "",
//   description: "",
//   price: "",
//   original_price: "",
//   discount_percentage: "",
//   stock: "",
//   image_url: "",
//   category_id: "",
// });

// function toCreatePayload(s: ProductFormState): ProductCreateInput {
//   return {
//     name: s.name.trim(),
//     description: s.description.trim() ? s.description.trim() : null,
//     price: Number(s.price),
//     original_price: s.original_price.trim() ? Number(s.original_price) : null,
//     discount_percentage: s.discount_percentage.trim()
//       ? Number(s.discount_percentage)
//       : null,
//     stock: Number(s.stock),
//     image_url: s.image_url.trim() ? s.image_url.trim() : null,
//     category_id: s.category_id.trim() ? Number(s.category_id) : null,
//   };
// }

// function toUpdatePayload(s: ProductFormState): ProductUpdateInput {
//   return {
//     name: s.name.trim(),
//     description: s.description.trim() ? s.description.trim() : null,
//     price: s.price.trim() ? Number(s.price) : null,
//     original_price: s.original_price.trim() ? Number(s.original_price) : null,
//     discount_percentage: s.discount_percentage.trim()
//       ? Number(s.discount_percentage)
//       : null,
//     stock: s.stock.trim() ? Number(s.stock) : null,
//     image_url: s.image_url.trim() ? s.image_url.trim() : null,
//     category_id: s.category_id.trim() ? Number(s.category_id) : null,
//   };
// }

// function fromProduct(p: ProductResponse): ProductFormState {
//   return {
//     name: p.name ?? "",
//     description: p.description ?? "",
//     price: String(p.price ?? ""),
//     original_price: p.original_price == null ? "" : String(p.original_price),
//     discount_percentage:
//       p.discount_percentage == null ? "" : String(p.discount_percentage),
//     stock: String(p.stock ?? ""),
//     image_url: p.image_url ?? "",
//     category_id: p.category?.id == null ? "" : String(p.category.id),
//   };
// }

// function isValidForCreate(s: ProductFormState): string | null {
//   if (!s.name.trim()) return "Name is required.";
//   if (!s.price.trim() || Number.isNaN(Number(s.price)))
//     return "Price must be a number.";
//   if (!s.stock.trim() || Number.isNaN(Number(s.stock)))
//     return "Stock must be a number.";
//   if (Number(s.price) < 0) return "Price cannot be negative.";
//   if (Number(s.stock) < 0) return "Stock cannot be negative.";
//   if (
//     s.discount_percentage.trim() &&
//     Number.isNaN(Number(s.discount_percentage))
//   )
//     return "Discount percentage must be a number.";
//   if (s.original_price.trim() && Number.isNaN(Number(s.original_price)))
//     return "Original price must be a number.";
//   return null;
// }

// export default function AdminProduct() {
//   const { data, isLoading, isFetching, error, refetch } = useListProductsQuery();

//   const [createProduct, createMeta] = useCreateProductMutation();
//   const [updateProduct, updateMeta] = useUpdateProductMutation();
//   const [deleteProduct, deleteMeta] = useDeleteProductMutation();

//   const [query, setQuery] = useState("");
//   const [form, setForm] = useState<ProductFormState>(emptyForm());
//   const [mode, setMode] = useState<FormMode>("create");
//   const [editing, setEditing] = useState<ProductResponse | null>(null);
//   const [toast, setToast] = useState<string | null>(null);

//   // ---- Cloudinary upload state ----
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null); // local preview
//   const [imageCloudUrl, setImageCloudUrl] = useState<string | null>(null); // cloudinary url
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const uploadSeq = useRef(0); // prevent races

//   const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
//   const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

//   async function uploadToCloudinary(file: File): Promise<string> {
//     if (!CLOUD_NAME || !UPLOAD_PRESET) {
//       throw new Error(
//         "Missing Cloudinary env vars: VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET"
//       );
//     }

//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("upload_preset", UPLOAD_PRESET);

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//       { method: "POST", body: fd }
//     );

//     const data = await res.json();
//     if (!res.ok) {
//       throw new Error(data?.error?.message || "Cloudinary upload failed");
//     }

//     return data.secure_url as string;
//   }

//   const filtered = useMemo(() => {
//     const list = data ?? [];
//     const q = query.trim().toLowerCase();
//     if (!q) return list;
//     return list.filter((p) => {
//       const category = p.category?.name ?? "";
//       const seller = p.seller?.name ?? "";
//       return (
//         p.name.toLowerCase().includes(q) ||
//         category.toLowerCase().includes(q) ||
//         seller.toLowerCase().includes(q)
//       );
//     });
//   }, [data, query]);

//   const busy =
//     isLoading ||
//     isFetching ||
//     uploadingImage ||
//     createMeta.isLoading ||
//     updateMeta.isLoading ||
//     deleteMeta.isLoading;

//   const showToast = (msg: string) => {
//     setToast(msg);
//     window.setTimeout(() => setToast(null), 2500);
//   };

//   const onChange = (key: keyof ProductFormState, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const clearImage = () => {
//     setImagePreview((prev) => {
//       // cleanup local blob url if any
//       if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
//       return null;
//     });
//     setImageCloudUrl(null);
//     onChange("image_url", "");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const resetToCreate = () => {
//     setMode("create");
//     setEditing(null);
//     setForm(emptyForm());
//     clearImage();
//   };

//   const openEdit = (p: ProductResponse) => {
//     setMode("edit");
//     setEditing(p);
//     setForm(fromProduct(p));

//     setImagePreview((prev) => {
//       if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
//       return null;
//     });
//     setImageCloudUrl(p.image_url ?? null);

//     if (fileInputRef.current) fileInputRef.current.value = "";

//     window.setTimeout(() => {
//       document
//         .getElementById("product-form-card")
//         ?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 50);
//   };

//   // ✅ Upload immediately on file select / drop
//   const handlePickFile = async (file: File | null) => {
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       showToast("Please select an image file.");
//       return;
//     }

//     // local preview instantly
//     const localUrl = URL.createObjectURL(file);
//     setImagePreview((prev) => {
//       if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
//       return localUrl;
//     });

//     const mySeq = ++uploadSeq.current;

//     setUploadingImage(true);
//     try {
//       showToast("Uploading image…");
//       const url = await uploadToCloudinary(file);

//       if (mySeq !== uploadSeq.current) return;

//       setImageCloudUrl(url);
//       onChange("image_url", url);
//       showToast("Image uploaded.");
//     } catch (e: any) {
//       if (mySeq !== uploadSeq.current) return;
//       setImageCloudUrl(null);
//       onChange("image_url", "");
//       showToast(e?.message || "Image upload failed.");
//     } finally {
//       if (mySeq === uploadSeq.current) setUploadingImage(false);
//     }
//   };

//   const submit = async () => {
//     const errMsg = isValidForCreate(form);
//     if (errMsg) {
//       showToast(errMsg);
//       return;
//     }

//     if (uploadingImage) {
//       showToast("Wait for the image to finish uploading.");
//       return;
//     }

//     try {
//       if (mode === "create") {
//         await createProduct(toCreatePayload(form)).unwrap();
//         showToast("Product created.");
//         setForm(emptyForm());
//         clearImage();
//       } else {
//         if (!editing) return;
//         await updateProduct({
//           product_id: editing.id,
//           body: toUpdatePayload(form),
//         }).unwrap();
//         showToast("Product updated.");
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

//   const onDelete = async (p: ProductResponse) => {
//     const ok = window.confirm(`Delete "${p.name}"? This can't be undone.`);
//     if (!ok) return;

//     try {
//       await deleteProduct(p.id).unwrap();
//       showToast("Product deleted.");
//       if (editing?.id === p.id) resetToCreate();
//     } catch (e: any) {
//       const msg =
//         e?.data?.detail ||
//         e?.error ||
//         "Failed to delete. Check your API and token.";
//       showToast(String(msg));
//     }
//   };

//   const previewSrc = imageCloudUrl || imagePreview || form.image_url || "";

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-blue-100/60 via-indigo-100/40 to-transparent" />

//       <div className="mx-auto w-full max-w-6xl px-4 py-6">
//         {/* Header */}
//         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h2 className="text-xl font-extrabold tracking-tight">
//               Admin · Products
//             </h2>
//             <p className="mt-1 text-sm text-slate-600">
//               Pick an image → auto-upload to Cloudinary → preview → save product.
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
//             id="product-form-card"
//             className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm"
//           >
//             <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
//               <h3 className="text-sm font-extrabold">
//                 {mode === "create"
//                   ? "Create product"
//                   : `Edit product #${editing?.id}`}
//               </h3>

//               <div className="flex items-center gap-2">
//                 {mode === "edit" ? (
//                   <button
//                     onClick={resetToCreate}
//                     disabled={busy}
//                     className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50 disabled:opacity-60"
//                   >
//                     Cancel
//                   </button>
//                 ) : (
//                   <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                     Required: name, price, stock
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="p-4">
//               <div className="grid gap-3">
//                 <label className="grid gap-1.5">
//                   <span className="text-xs font-bold text-slate-700">Name *</span>
//                   <input
//                     value={form.name}
//                     onChange={(e) => onChange("name", e.target.value)}
//                     placeholder="e.g. Nike Air Max"
//                     className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
//                   />
//                 </label>

//                 <label className="grid gap-1.5">
//                   <span className="text-xs font-bold text-slate-700">
//                     Description
//                   </span>
//                   <textarea
//                     value={form.description}
//                     onChange={(e) => onChange("description", e.target.value)}
//                     placeholder="Optional"
//                     rows={3}
//                     className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
//                   />
//                 </label>

//                 <div className="grid gap-3 sm:grid-cols-2">
//                   <label className="grid gap-1.5">
//                     <span className="text-xs font-bold text-slate-700">
//                       Price * (number)
//                     </span>
//                     <input
//                       value={form.price}
//                       onChange={(e) => onChange("price", e.target.value)}
//                       placeholder="e.g. 1200"
//                       inputMode="decimal"
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
//                     />
//                   </label>

//                   <label className="grid gap-1.5">
//                     <span className="text-xs font-bold text-slate-700">
//                       Stock * (number)
//                     </span>
//                     <input
//                       value={form.stock}
//                       onChange={(e) => onChange("stock", e.target.value)}
//                       placeholder="e.g. 45"
//                       inputMode="numeric"
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
//                     />
//                   </label>
//                 </div>

//                 <div className="grid gap-3 sm:grid-cols-2">
//                   <label className="grid gap-1.5">
//                     <span className="text-xs font-bold text-slate-700">
//                       Original price
//                     </span>
//                     <input
//                       value={form.original_price}
//                       onChange={(e) => onChange("original_price", e.target.value)}
//                       placeholder="Optional"
//                       inputMode="decimal"
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
//                     />
//                   </label>

//                   <label className="grid gap-1.5">
//                     <span className="text-xs font-bold text-slate-700">
//                       Discount % (number)
//                     </span>
//                     <input
//                       value={form.discount_percentage}
//                       onChange={(e) =>
//                         onChange("discount_percentage", e.target.value)
//                       }
//                       placeholder="Optional"
//                       inputMode="decimal"
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
//                     />
//                   </label>
//                 </div>

//                 {/* ✅ Professional Cloud-like uploader (dropzone) */}
//                 <label className="grid gap-2">
//                   <span className="text-xs font-bold text-slate-700">
//                     Product image (uploads immediately)
//                   </span>

//                   <div
//                     className={[
//                       "group relative flex min-h-[160px] w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-4 text-center shadow-sm transition",
//                       "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30",
//                       uploadingImage ? "opacity-90" : "",
//                     ].join(" ")}
//                     onDragOver={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                     }}
//                     onDrop={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       const f = e.dataTransfer.files?.[0] ?? null;
//                       if (f) handlePickFile(f);
//                     }}
//                   >
//                     {/* hidden input */}
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) =>
//                         handlePickFile(e.target.files?.[0] ?? null)
//                       }
//                     />

//                     {/* Upload overlay */}
//                     {uploadingImage && (
//                       <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur">
//                         <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
//                           <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
//                           <span className="text-sm font-bold text-slate-700">
//                             Uploading to Cloudinary…
//                           </span>
//                         </div>
//                       </div>
//                     )}

//                     {/* With preview */}
//                     {previewSrc ? (
//                       <div className="grid w-full gap-3">
//                         <div className="relative overflow-hidden rounded-2xl border border-slate-200">
//                           <img
//                             src={previewSrc}
//                             alt="Preview"
//                             className="h-48 w-full object-cover"
//                           />

//                           <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-3">
//                             <div className="flex flex-wrap items-center gap-2">
//                               {form.image_url && !uploadingImage ? (
//                                 <span className="rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-extrabold text-white">
//                                   Uploaded ✓
//                                 </span>
//                               ) : (
//                                 <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-extrabold text-white">
//                                   Preview
//                                 </span>
//                               )}

//                               {form.image_url && (
//                                 <a
//                                   href={form.image_url}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                   className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-slate-900 hover:bg-white"
//                                 >
//                                   Open
//                                 </a>
//                               )}
//                             </div>

//                             <div className="flex items-center gap-2">
//                               <button
//                                 type="button"
//                                 disabled={busy}
//                                 onClick={() => fileInputRef.current?.click()}
//                                 className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-900 hover:bg-white disabled:opacity-60"
//                               >
//                                 Change
//                               </button>
//                               <button
//                                 type="button"
//                                 disabled={busy}
//                                 onClick={clearImage}
//                                 className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-extrabold text-white hover:bg-red-500 disabled:opacity-60"
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           </div>
//                         </div>

//                         <p className="text-[11px] text-slate-500">
//                           Drag & drop an image here, or{" "}
//                           <button
//                             type="button"
//                             onClick={() => fileInputRef.current?.click()}
//                             className="font-extrabold text-blue-700 hover:underline"
//                           >
//                             browse
//                           </button>
//                           . Cloudinary URL is stored as <b>image_url</b>.
//                         </p>
//                       </div>
//                     ) : (
//                       // Empty state (cloud + arrow)
//                       <div className="flex flex-col items-center gap-3">
//                         <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition group-hover:border-blue-200 group-hover:bg-blue-50">
//                           <svg
//                             viewBox="0 0 24 24"
//                             className="h-6 w-6"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           >
//                             <path
//                               d="M7 18a4 4 0 0 1 .4-8 5 5 0 0 1 9.8 1.1A3.5 3.5 0 0 1 18.5 18H7Z"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                             <path
//                               d="M12 12v7"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                             <path
//                               d="m9 15 3-3 3 3"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         </div>

//                         <div className="space-y-1">
//                           <p className="text-sm font-extrabold text-slate-900">
//                             Drop image here, or click to upload
//                           </p>
//                           <p className="text-xs text-slate-500">
//                             PNG, JPG, WEBP — auto upload to Cloudinary
//                           </p>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => fileInputRef.current?.click()}
//                           disabled={busy}
//                           className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
//                         >
//                           Choose file
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <input type="hidden" value={form.image_url} readOnly />
//                 </label>

//                 <label className="grid gap-1.5">
//                   <span className="text-xs font-bold text-slate-700">
//                     Category ID
//                   </span>
//                   <input
//                     value={form.category_id}
//                     onChange={(e) => onChange("category_id", e.target.value)}
//                     placeholder="Optional numeric id"
//                     inputMode="numeric"
//                     className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
//                   />
//                 </label>

//                 <button
//                   onClick={submit}
//                   disabled={busy}
//                   className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-60"
//                 >
//                   {mode === "create"
//                     ? createMeta.isLoading
//                       ? "Creating…"
//                       : "Create product"
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

//           {/* List */}
//           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
//             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
//               <h3 className="text-sm font-extrabold">Products</h3>
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search name / category / seller…"
//                 className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
//               />
//             </div>

//             <div className="p-4">
//               {isLoading && <p className="text-sm text-slate-600">Loading…</p>}
//               {error && (
//                 <div className="text-sm font-bold text-red-600">
//                   Failed to load products. Make sure VITE_API_BASE_URL is correct
//                   and token exists.
//                 </div>
//               )}

//               {/* Desktop table */}
//               <div className="hidden overflow-x-auto lg:block">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
//                       {[
//                         "Name",
//                         "Price",
//                         "Stock",
//                         "Discount",
//                         "Category",
//                         "Seller",
//                         "Updated",
//                         "Actions",
//                       ].map((h) => (
//                         <th
//                           key={h}
//                           className="whitespace-nowrap border-b border-slate-100 px-2 py-3"
//                         >
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(filtered ?? []).map((p) => (
//                       <tr key={p.id} className="border-b border-slate-50">
//                         <td className="px-2 py-3">
//                           <div className="font-extrabold">{p.name}</div>
//                           <div className="mt-0.5 text-xs text-slate-500">
//                             #{p.id} •{" "}
//                             {p.description
//                               ? p.description.slice(0, 48)
//                               : "No description"}
//                             {p.description && p.description.length > 48
//                               ? "…"
//                               : ""}
//                           </div>
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3 font-bold">
//                           {p.price}
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3">
//                           {p.stock}
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3">
//                           <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                             {p.discount_percentage ?? 0}%
//                           </span>
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3">
//                           {p.category?.name ??
//                             (p.category?.id ? `#${p.category.id}` : "—")}
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3">
//                           {p.seller?.name ?? `#${p.seller?.id ?? "—"}`}
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
//                           {new Date(p.updated_at).toLocaleString()}
//                         </td>
//                         <td className="whitespace-nowrap px-2 py-3">
//                           <div className="flex flex-wrap gap-2">
//                             <button
//                               onClick={() => openEdit(p)}
//                               disabled={busy}
//                               className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => onDelete(p)}
//                               disabled={busy}
//                               className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
//                             >
//                               {deleteMeta.isLoading ? "Deleting…" : "Delete"}
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}

//                     {!isLoading && (filtered?.length ?? 0) === 0 && (
//                       <tr>
//                         <td
//                           colSpan={8}
//                           className="px-2 py-4 text-sm text-slate-500"
//                         >
//                           No products found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile cards */}
//               <div className="grid gap-3 lg:hidden">
//                 {(filtered ?? []).map((p) => (
//                   <div
//                     key={p.id}
//                     className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <div className="text-sm font-extrabold">{p.name}</div>
//                         <div className="mt-0.5 text-xs text-slate-500">
//                           #{p.id} •{" "}
//                           {p.category?.name ??
//                             (p.category?.id ? `#${p.category.id}` : "No category")}
//                         </div>
//                       </div>
//                       <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                         {p.discount_percentage ?? 0}%
//                       </span>
//                     </div>

//                     <div className="mt-2 flex flex-wrap gap-2">
//                       <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                         Price: {p.price}
//                       </span>
//                       <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                         Stock: {p.stock}
//                       </span>
//                       <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
//                         Seller: {p.seller?.name ?? `#${p.seller?.id ?? "—"}`}
//                       </span>
//                     </div>

//                     <div className="mt-2 text-xs text-slate-600">
//                       {p.description ? p.description : "No description"}
//                     </div>

//                     <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
//                       <div className="text-xs text-slate-500">
//                         Updated: {new Date(p.updated_at).toLocaleString()}
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           onClick={() => openEdit(p)}
//                           disabled={busy}
//                           className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => onDelete(p)}
//                           disabled={busy}
//                           className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
//                         >
//                           {deleteMeta.isLoading ? "Deleting…" : "Delete"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {!isLoading && (filtered?.length ?? 0) === 0 && (
//                   <div className="text-sm text-slate-500">No products found.</div>
//                 )}
//               </div>

//               <div className="mt-3 text-xs text-slate-500">
//                 {busy ? "Working…" : `Showing ${filtered.length} item(s).`}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// src/admin/AdminProduct.tsx
import { useMemo, useRef, useState } from "react";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useListProductsQuery,
  useUpdateProductMutation,
} from "../products/productsAPI";


import {
  useListCategoriesQuery,
} from ".././categories/catagoriesAPI";

import type {
  ProductCreateInput,
  ProductResponse,
  ProductUpdateInput,
} from "../products/productsAPI";

type FormMode = "create" | "edit";

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  original_price: string;
  discount_percentage: string;
  stock: string;
  image_url: string;
  category_id: string; // store selected category id as string
};

type Category = {
  id: number;
  name: string;
  description?: string | null;
};

const emptyForm = (): ProductFormState => ({
  name: "",
  description: "",
  price: "",
  original_price: "",
  discount_percentage: "",
  stock: "",
  image_url: "",
  category_id: "",
});

function toCreatePayload(s: ProductFormState): ProductCreateInput {
  return {
    name: s.name.trim(),
    description: s.description.trim() ? s.description.trim() : null,
    price: Number(s.price),
    original_price: s.original_price.trim() ? Number(s.original_price) : null,
    discount_percentage: s.discount_percentage.trim()
      ? Number(s.discount_percentage)
      : null,
    stock: Number(s.stock),
    image_url: s.image_url.trim() ? s.image_url.trim() : null,
    category_id: s.category_id.trim() ? Number(s.category_id) : null,
  };
}

function toUpdatePayload(s: ProductFormState): ProductUpdateInput {
  return {
    name: s.name.trim(),
    description: s.description.trim() ? s.description.trim() : null,
    price: s.price.trim() ? Number(s.price) : null,
    original_price: s.original_price.trim() ? Number(s.original_price) : null,
    discount_percentage: s.discount_percentage.trim()
      ? Number(s.discount_percentage)
      : null,
    stock: s.stock.trim() ? Number(s.stock) : null,
    image_url: s.image_url.trim() ? s.image_url.trim() : null,
    category_id: s.category_id.trim() ? Number(s.category_id) : null,
  };
}

function fromProduct(p: ProductResponse): ProductFormState {
  return {
    name: p.name ?? "",
    description: p.description ?? "",
    price: String(p.price ?? ""),
    original_price: p.original_price == null ? "" : String(p.original_price),
    discount_percentage:
      p.discount_percentage == null ? "" : String(p.discount_percentage),
    stock: String(p.stock ?? ""),
    image_url: p.image_url ?? "",
    category_id: p.category?.id == null ? "" : String(p.category.id),
  };
}

function isValidForCreate(s: ProductFormState): string | null {
  if (!s.name.trim()) return "Name is required.";
  if (!s.price.trim() || Number.isNaN(Number(s.price)))
    return "Price must be a number.";
  if (!s.stock.trim() || Number.isNaN(Number(s.stock)))
    return "Stock must be a number.";
  if (Number(s.price) < 0) return "Price cannot be negative.";
  if (Number(s.stock) < 0) return "Stock cannot be negative.";
  if (
    s.discount_percentage.trim() &&
    Number.isNaN(Number(s.discount_percentage))
  )
    return "Discount percentage must be a number.";
  if (s.original_price.trim() && Number.isNaN(Number(s.original_price)))
    return "Original price must be a number.";
  // category optional in your payload; if you want REQUIRED, uncomment:
  // if (!s.category_id.trim()) return "Category is required.";
  return null;
}

export default function AdminProduct() {
  const { data, isLoading, isFetching, error, refetch } = useListProductsQuery();

  // ✅ categories (admin selects category from dropdown)
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
    error: categoriesError,
    refetch: refetchCategories,
  } = useListCategoriesQuery();

  const categories = (categoriesData ?? []) as Category[];

  const [createProduct, createMeta] = useCreateProductMutation();
  const [updateProduct, updateMeta] = useUpdateProductMutation();
  const [deleteProduct, deleteMeta] = useDeleteProductMutation();

  const [query, setQuery] = useState("");
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [mode, setMode] = useState<FormMode>("create");
  const [editing, setEditing] = useState<ProductResponse | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ---- Cloudinary upload state ----
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // local preview
  const [imageCloudUrl, setImageCloudUrl] = useState<string | null>(null); // cloudinary url
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadSeq = useRef(0); // prevent races

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  async function uploadToCloudinary(file: File): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Missing Cloudinary env vars: VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET"
      );
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || "Cloudinary upload failed");
    }

    return data.secure_url as string;
  }

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => {
      const category = p.category?.name ?? "";
      const seller = p.seller?.name ?? "";
      return (
        p.name.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        seller.toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  const busy =
    isLoading ||
    isFetching ||
    categoriesLoading ||
    categoriesFetching ||
    uploadingImage ||
    createMeta.isLoading ||
    updateMeta.isLoading ||
    deleteMeta.isLoading;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const onChange = (key: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const clearImage = () => {
    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setImageCloudUrl(null);
    onChange("image_url", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetToCreate = () => {
    setMode("create");
    setEditing(null);
    setForm(emptyForm());
    clearImage();
  };

  const openEdit = (p: ProductResponse) => {
    setMode("edit");
    setEditing(p);
    setForm(fromProduct(p));

    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setImageCloudUrl(p.image_url ?? null);

    if (fileInputRef.current) fileInputRef.current.value = "";

    window.setTimeout(() => {
      document
        .getElementById("product-form-card")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // ✅ Upload immediately on file select / drop
  const handlePickFile = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return localUrl;
    });

    const mySeq = ++uploadSeq.current;

    setUploadingImage(true);
    try {
      showToast("Uploading image…");
      const url = await uploadToCloudinary(file);

      if (mySeq !== uploadSeq.current) return;

      setImageCloudUrl(url);
      onChange("image_url", url);
      showToast("Image uploaded.");
    } catch (e: any) {
      if (mySeq !== uploadSeq.current) return;
      setImageCloudUrl(null);
      onChange("image_url", "");
      showToast(e?.message || "Image upload failed.");
    } finally {
      if (mySeq === uploadSeq.current) setUploadingImage(false);
    }
  };

  const submit = async () => {
    const errMsg = isValidForCreate(form);
    if (errMsg) {
      showToast(errMsg);
      return;
    }

    if (uploadingImage) {
      showToast("Wait for the image to finish uploading.");
      return;
    }

    try {
      if (mode === "create") {
        await createProduct(toCreatePayload(form)).unwrap();
        showToast("Product created.");
        setForm(emptyForm());
        clearImage();
      } else {
        if (!editing) return;
        await updateProduct({
          product_id: editing.id,
          body: toUpdatePayload(form),
        }).unwrap();
        showToast("Product updated.");
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

  const onDelete = async (p: ProductResponse) => {
    const ok = window.confirm(`Delete "${p.name}"? This can't be undone.`);
    if (!ok) return;

    try {
      await deleteProduct(p.id).unwrap();
      showToast("Product deleted.");
      if (editing?.id === p.id) resetToCreate();
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.error ||
        "Failed to delete. Check your API and token.";
      showToast(String(msg));
    }
  };

  const previewSrc = imageCloudUrl || imagePreview || form.image_url || "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-blue-100/60 via-indigo-100/40 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Admin · Products
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Pick an image → auto-upload to Cloudinary → preview → save product.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={busy}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              {isFetching ? "Refreshing…" : "Refresh products"}
            </button>

            <button
              onClick={() => refetchCategories()}
              disabled={busy}
              className="hidden sm:inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              title="Reload categories"
            >
              {categoriesFetching ? "Refreshing…" : "Refresh categories"}
            </button>
          </div>
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
            id="product-form-card"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-extrabold">
                {mode === "create"
                  ? "Create product"
                  : `Edit product #${editing?.id}`}
              </h3>

              <div className="flex items-center gap-2">
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
                    Required: name, price, stock
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="grid gap-3">
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">Name *</span>
                  <input
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    placeholder="e.g. Nike Air Max"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    Description
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Optional"
                    rows={3}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Price * (number)
                    </span>
                    <input
                      value={form.price}
                      onChange={(e) => onChange("price", e.target.value)}
                      placeholder="e.g. 1200"
                      inputMode="decimal"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Stock * (number)
                    </span>
                    <input
                      value={form.stock}
                      onChange={(e) => onChange("stock", e.target.value)}
                      placeholder="e.g. 45"
                      inputMode="numeric"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Original price
                    </span>
                    <input
                      value={form.original_price}
                      onChange={(e) => onChange("original_price", e.target.value)}
                      placeholder="Optional"
                      inputMode="decimal"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      Discount % (number)
                    </span>
                    <input
                      value={form.discount_percentage}
                      onChange={(e) =>
                        onChange("discount_percentage", e.target.value)
                      }
                      placeholder="Optional"
                      inputMode="decimal"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                </div>

                {/* ✅ Category dropdown (no typing IDs) */}
                <label className="grid gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      Category
                    </span>

                    {categoriesError ? (
                      <span className="text-[11px] font-bold text-red-600">
                        Failed to load categories
                      </span>
                    ) : categoriesLoading || categoriesFetching ? (
                      <span className="text-[11px] font-bold text-slate-500">
                        Loading…
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">
                        {categories.length} available
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      value={form.category_id}
                      onChange={(e) => onChange("category_id", e.target.value)}
                      disabled={categoriesLoading || categoriesFetching}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                    >
                      <option value="">
                        {categoriesLoading || categoriesFetching
                          ? "Loading categories…"
                          : "Select category (optional)"}
                      </option>

                      {categories
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.name}
                          </option>
                        ))}
                    </select>

                    {/* chevron */}
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  {/* tiny description preview */}
                  {form.category_id && (
                    <div className="text-[11px] text-slate-500">
                      Selected:{" "}
                      <span className="font-extrabold text-slate-700">
                        {categories.find((c) => String(c.id) === form.category_id)
                          ?.name ?? `#${form.category_id}`}
                      </span>
                    </div>
                  )}
                </label>

                {/* ✅ Professional Cloud-like uploader (dropzone) */}
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    Product image (uploads immediately)
                  </span>

                  <div
                    className={[
                      "group relative flex min-h-[160px] w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-4 text-center shadow-sm transition",
                      "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30",
                      uploadingImage ? "opacity-90" : "",
                    ].join(" ")}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const f = e.dataTransfer.files?.[0] ?? null;
                      if (f) handlePickFile(f);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handlePickFile(e.target.files?.[0] ?? null)
                      }
                    />

                    {uploadingImage && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur">
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                          <span className="text-sm font-bold text-slate-700">
                            Uploading to Cloudinary…
                          </span>
                        </div>
                      </div>
                    )}

                    {previewSrc ? (
                      <div className="grid w-full gap-3">
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                          <img
                            src={previewSrc}
                            alt="Preview"
                            className="h-48 w-full object-cover"
                          />

                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {form.image_url && !uploadingImage ? (
                                <span className="rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-extrabold text-white">
                                  Uploaded ✓
                                </span>
                              ) : (
                                <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-extrabold text-white">
                                  Preview
                                </span>
                              )}

                              {form.image_url && (
                                <a
                                  href={form.image_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-slate-900 hover:bg-white"
                                >
                                  Open
                                </a>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-900 hover:bg-white disabled:opacity-60"
                              >
                                Change
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={clearImage}
                                className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-extrabold text-white hover:bg-red-500 disabled:opacity-60"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Drag & drop, or{" "}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="font-extrabold text-blue-700 hover:underline"
                          >
                            browse
                          </button>
                          . Cloudinary URL is stored as <b>image_url</b>.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition group-hover:border-blue-200 group-hover:bg-blue-50">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M7 18a4 4 0 0 1 .4-8 5 5 0 0 1 9.8 1.1A3.5 3.5 0 0 1 18.5 18H7Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 12v7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="m9 15 3-3 3 3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-extrabold text-slate-900">
                            Drop image here, or click to upload
                          </p>
                          <p className="text-xs text-slate-500">
                            PNG, JPG, WEBP — auto upload to Cloudinary
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={busy}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                        >
                          Choose file
                        </button>
                      </div>
                    )}
                  </div>

                  <input type="hidden" value={form.image_url} readOnly />
                </label>

                <button
                  onClick={submit}
                  disabled={busy}
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-60"
                >
                  {mode === "create"
                    ? createMeta.isLoading
                      ? "Creating…"
                      : "Create product"
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

          {/* List */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-extrabold">Products</h3>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name / category / seller…"
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="p-4">
              {isLoading && <p className="text-sm text-slate-600">Loading…</p>}
              {error && (
                <div className="text-sm font-bold text-red-600">
                  Failed to load products. Make sure VITE_API_BASE_URL is correct
                  and token exists.
                </div>
              )}

              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {[
                        "Name",
                        "Price",
                        "Stock",
                        "Discount",
                        "Category",
                        "Seller",
                        "Updated",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap border-b border-slate-100 px-2 py-3"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(filtered ?? []).map((p) => (
                      <tr key={p.id} className="border-b border-slate-50">
                        <td className="px-2 py-3">
                          <div className="font-extrabold">{p.name}</div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            #{p.id} •{" "}
                            {p.description
                              ? p.description.slice(0, 48)
                              : "No description"}
                            {p.description && p.description.length > 48
                              ? "…"
                              : ""}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 font-bold">
                          {p.price}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          {p.stock}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                            {p.discount_percentage ?? 0}%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          {p.category?.name ??
                            (p.category?.id ? `#${p.category.id}` : "—")}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          {p.seller?.name ?? `#${p.seller?.id ?? "—"}`}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
                          {new Date(p.updated_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              disabled={busy}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(p)}
                              disabled={busy}
                              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                            >
                              {deleteMeta.isLoading ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!isLoading && (filtered?.length ?? 0) === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-2 py-4 text-sm text-slate-500"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 lg:hidden">
                {(filtered ?? []).map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold">{p.name}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          #{p.id} •{" "}
                          {p.category?.name ??
                            (p.category?.id
                              ? `#${p.category.id}`
                              : "No category")}
                        </div>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                        {p.discount_percentage ?? 0}%
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                        Price: {p.price}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                        Stock: {p.stock}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                        Seller: {p.seller?.name ?? `#${p.seller?.id ?? "—"}`}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      {p.description ? p.description : "No description"}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-slate-500">
                        Updated: {new Date(p.updated_at).toLocaleString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          disabled={busy}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          disabled={busy}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                        >
                          {deleteMeta.isLoading ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!isLoading && (filtered?.length ?? 0) === 0 && (
                  <div className="text-sm text-slate-500">No products found.</div>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-500">
                {busy ? "Working…" : `Showing ${filtered.length} item(s).`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}