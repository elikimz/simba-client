// src/admin/AdminManageBanner.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAdminAddBannerImageMutation,
  useAdminCreateBannerMutation,
  useAdminDeleteBannerImageMutation,
  useAdminDeleteBannerMutation,
  useAdminListAllBannersQuery,
  useAdminSetPrimaryImageMutation,
  useAdminUpdateBannerMutation,
} from "../../features/banner/bannerAPI";
import type {
  HeroBannerCreateInput,
  HeroBannerImageResponse,
  HeroBannerResponse,
  HeroBannerUpdateInput,
} from "../../features/banner/bannerAPI";

type FormMode = "create" | "edit";

type BannerFormState = {
  title: string;
  description: string;
  cta_text: string;
  cta_href: string;
  starts_at: string; // datetime-local
  ends_at: string; // datetime-local
  is_active: boolean;
  sort_order: string; // keep as string in inputs
};

const emptyForm = (): BannerFormState => ({
  title: "",
  description: "",
  cta_text: "Shop Now",
  cta_href: "/products",
  starts_at: "",
  ends_at: "",
  is_active: true,
  sort_order: "0",
});

const toIsoOrNull = (dtLocal: string): string | null => {
  if (!dtLocal.trim()) return null;
  const d = new Date(dtLocal);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const fromIsoToLocal = (iso?: string | null): string => {
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

const fromBanner = (b: HeroBannerResponse): BannerFormState => ({
  title: b.title ?? "",
  description: b.description ?? "",
  cta_text: b.cta_text ?? "Shop Now",
  cta_href: b.cta_href ?? "/products",
  starts_at: fromIsoToLocal(b.starts_at),
  ends_at: fromIsoToLocal(b.ends_at),
  is_active: !!b.is_active,
  sort_order: String(b.sort_order ?? 0),
});

const validateForm = (s: BannerFormState): string | null => {
  if (!s.title.trim()) return "Title is required.";
  if (s.sort_order.trim() && Number.isNaN(Number(s.sort_order)))
    return "Sort order must be a number.";
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

export default function AdminManageBanner() {
  const { data, isLoading, isFetching, error, refetch } =
    useAdminListAllBannersQuery();

  const [createBanner, createMeta] = useAdminCreateBannerMutation();
  const [updateBanner, updateMeta] = useAdminUpdateBannerMutation();
  const [deleteBanner, deleteMeta] = useAdminDeleteBannerMutation();

  const [addImage, addImageMeta] = useAdminAddBannerImageMutation();
  const [deleteImage, deleteImageMeta] = useAdminDeleteBannerImageMutation();
  const [setPrimary, setPrimaryMeta] = useAdminSetPrimaryImageMutation();

  const [toast, setToast] = useState<string | null>(null);

  const [mode, setMode] = useState<FormMode>("create");
  const [editing, setEditing] = useState<HeroBannerResponse | null>(null);
  const [form, setForm] = useState<BannerFormState>(emptyForm());

  // image uploader state (Cloudinary)
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCloudUrl, setImageCloudUrl] = useState<string | null>(null);

  const [imgSortOrder, setImgSortOrder] = useState<string>("0");
  const [imgIsPrimary, setImgIsPrimary] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadSeq = useRef(0);

  const formCardRef = useRef<HTMLDivElement | null>(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  const busy =
    isLoading ||
    isFetching ||
    uploadingImage ||
    createMeta.isLoading ||
    updateMeta.isLoading ||
    deleteMeta.isLoading ||
    addImageMeta.isLoading ||
    deleteImageMeta.isLoading ||
    setPrimaryMeta.isLoading;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const onChange = (key: keyof BannerFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value } as BannerFormState));
  };

  const resetToCreate = () => {
    setMode("create");
    setEditing(null);
    setForm(emptyForm());
    clearUploader();
    setImgSortOrder("0");
    setImgIsPrimary(false);
  };

  const openEdit = (b: HeroBannerResponse) => {
    setMode("edit");
    setEditing(b);
    setForm(fromBanner(b));
    clearUploader();
    setImgSortOrder("0");
    setImgIsPrimary(false);

    window.setTimeout(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

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

    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message || "Cloudinary upload failed");

    return json.secure_url as string;
  }

  const clearUploader = () => {
    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setImageCloudUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      showToast("Image uploaded. Now click “Add image to banner”.");
    } catch (e: any) {
      if (mySeq !== uploadSeq.current) return;
      setImageCloudUrl(null);
      showToast(e?.message || "Image upload failed.");
    } finally {
      if (mySeq === uploadSeq.current) setUploadingImage(false);
    }
  };

  const previewSrc = imageCloudUrl || imagePreview || "";

  const submitBanner = async () => {
    const errMsg = validateForm(form);
    if (errMsg) {
      showToast(errMsg);
      return;
    }

    const base = {
      title: form.title.trim(),
      description: form.description.trim() ? form.description.trim() : null,
      cta_text: form.cta_text.trim() ? form.cta_text.trim() : "Shop Now",
      cta_href: form.cta_href.trim() ? form.cta_href.trim() : "/products",
      starts_at: toIsoOrNull(form.starts_at),
      ends_at: toIsoOrNull(form.ends_at),
      is_active: form.is_active,
      sort_order: form.sort_order.trim() ? Number(form.sort_order) : 0,
    };

    try {
      if (mode === "create") {
        const body: HeroBannerCreateInput = {
          ...base,
          images: [], // images are added via /images endpoint
        };
        const created = await createBanner(body).unwrap();
        showToast("Banner created. You can now add images.");
        openEdit(created);
        await refetch();
      } else {
        if (!editing) return;
        const body: HeroBannerUpdateInput = base;
        await updateBanner({ banner_id: editing.id, body }).unwrap();
        showToast("Banner updated.");
        await refetch();
      }
    } catch (e: any) {
      const msg =
        e?.data?.detail || e?.error || e?.message || "Something went wrong.";
      showToast(String(msg));
    }
  };

  const addImageToBanner = async () => {
    if (!editing) {
      showToast("Create the banner first, then add images.");
      return;
    }
    if (uploadingImage) {
      showToast("Wait for the image to finish uploading.");
      return;
    }
    if (!imageCloudUrl) {
      showToast("Upload an image first.");
      return;
    }

    const so = imgSortOrder.trim() ? Number(imgSortOrder) : 0;
    if (Number.isNaN(so)) {
      showToast("Image sort order must be a number.");
      return;
    }

    try {
      await addImage({
        banner_id: editing.id,
        url: imageCloudUrl,
        sort_order: so,
        is_primary: imgIsPrimary,
      }).unwrap();

      showToast("Image added to banner.");
      clearUploader();
      setImgSortOrder("0");
      setImgIsPrimary(false);
      await refetch();
    } catch (e: any) {
      const msg =
        e?.data?.detail || e?.error || e?.message || "Failed to add image.";
      showToast(String(msg));
    }
  };

  const onDeleteBanner = async (b: HeroBannerResponse) => {
    const ok = window.confirm(`Delete banner "${b.title}"? This can't be undone.`);
    if (!ok) return;

    try {
      await deleteBanner(b.id).unwrap();
      showToast("Banner deleted.");
      if (editing?.id === b.id) resetToCreate();
      await refetch();
    } catch (e: any) {
      showToast(String(e?.data?.detail || e?.message || "Failed to delete banner."));
    }
  };

  const onDeleteImage = async (image: HeroBannerImageResponse) => {
    const ok = window.confirm("Delete this image? This can't be undone.");
    if (!ok) return;

    try {
      await deleteImage(image.id).unwrap();
      showToast("Image deleted.");
      await refetch();
    } catch (e: any) {
      showToast(String(e?.data?.detail || e?.message || "Failed to delete image."));
    }
  };

  const onSetPrimary = async (image: HeroBannerImageResponse) => {
    try {
      await setPrimary({ image_id: image.id, banner_id: image.banner_id }).unwrap();
      showToast("Primary image set.");
      await refetch();
    } catch (e: any) {
      showToast(String(e?.data?.detail || e?.message || "Failed to set primary."));
    }
  };

  const banners = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    return () => {
      // cleanup blob url on unmount
      setImagePreview((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return prev;
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-indigo-100/60 via-sky-100/40 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Admin · Hero Banners
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Create banners, then upload and attach multiple images. Set a primary image.
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
                {mode === "create" ? "Create banner" : `Edit banner #${editing?.id}`}
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
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">Title *</span>
                  <input
                    value={form.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    placeholder="e.g. Big February Sale"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    placeholder="Optional"
                    rows={3}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">CTA Text</span>
                    <input
                      value={form.cta_text}
                      onChange={(e) => onChange("cta_text", e.target.value)}
                      placeholder="Shop Now"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">CTA Link</span>
                    <input
                      value={form.cta_href}
                      onChange={(e) => onChange("cta_href", e.target.value)}
                      placeholder="/products"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">Starts at</span>
                    <input
                      type="datetime-local"
                      value={form.starts_at}
                      onChange={(e) => onChange("starts_at", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">Ends at</span>
                    <input
                      type="datetime-local"
                      value={form.ends_at}
                      onChange={(e) => onChange("ends_at", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => onChange("is_active", e.target.checked)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <span className="text-sm font-bold text-slate-700">Is active</span>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold text-slate-700">Sort order</span>
                    <input
                      value={form.sort_order}
                      onChange={(e) => onChange("sort_order", e.target.value)}
                      inputMode="numeric"
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                </div>

                <button
                  onClick={submitBanner}
                  disabled={busy}
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-indigo-600 to-indigo-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-60"
                >
                  {mode === "create"
                    ? createMeta.isLoading
                      ? "Creating…"
                      : "Create banner"
                    : updateMeta.isLoading
                    ? "Saving…"
                    : "Save banner"}
                </button>

                {(createMeta.isError || updateMeta.isError) && (
                  <div className="text-sm font-bold text-red-600">
                    Save failed. Check console/network.
                  </div>
                )}

                {/* Image uploader (only useful when editing) */}
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-extrabold text-slate-900">
                      Banner images
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-extrabold text-slate-700">
                      {editing?.images?.length ?? 0} image(s)
                    </span>
                  </div>

                  {!editing ? (
                    <div className="mt-2 text-xs text-slate-600">
                      Create the banner first, then upload images.
                    </div>
                  ) : (
                    <>
                      {/* Dropzone */}
                      <div
                        className={[
                          "group relative mt-3 flex min-h-[160px] w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-4 text-center shadow-sm transition",
                          "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30",
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
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
                        />

                        {uploadingImage && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur">
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
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
                                <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-extrabold text-white">
                                  {imageCloudUrl ? "Uploaded ✓" : "Preview"}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      fileInputRef.current?.click();
                                    }}
                                    disabled={busy}
                                    className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-slate-900 hover:bg-white disabled:opacity-60"
                                  >
                                    Change
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearUploader();
                                    }}
                                    disabled={busy}
                                    className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-extrabold text-white hover:bg-red-500 disabled:opacity-60"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500">
                              Click or drop to replace. Upload happens immediately.
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition group-hover:border-indigo-200 group-hover:bg-indigo-50">
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
                                <path d="M12 12v7" strokeLinecap="round" strokeLinejoin="round" />
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
                              disabled={busy}
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                            >
                              Choose file
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Image meta + add */}
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <label className="grid gap-1.5">
                          <span className="text-xs font-bold text-slate-700">
                            Image sort order
                          </span>
                          <input
                            value={imgSortOrder}
                            onChange={(e) => setImgSortOrder(e.target.value)}
                            inputMode="numeric"
                            placeholder="0"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                          />
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <input
                            type="checkbox"
                            checked={imgIsPrimary}
                            onChange={(e) => setImgIsPrimary(e.target.checked)}
                            className="h-4 w-4 accent-indigo-600"
                          />
                          <span className="text-sm font-bold text-slate-700">
                            Set as primary
                          </span>
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={addImageToBanner}
                        disabled={busy || !imageCloudUrl}
                        className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900 disabled:opacity-60"
                      >
                        {addImageMeta.isLoading ? "Adding…" : "Add image to banner"}
                      </button>

                      {/* Existing images */}
                      <div className="mt-3 grid gap-2">
                        {(editing.images ?? []).length === 0 ? (
                          <div className="text-xs text-slate-600">
                            No images yet. Upload and add one.
                          </div>
                        ) : (
                          <div className="grid gap-2">
                            {editing.images
                              .slice()
                              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                              .map((img) => (
                                <div
                                  key={img.id}
                                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2"
                                >
                                  <img
                                    src={img.url}
                                    alt="Banner"
                                    className="h-14 w-20 rounded-xl border border-slate-200 object-cover"
                                  />

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-extrabold text-slate-900">
                                        #{img.id}
                                      </span>
                                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-extrabold text-slate-700">
                                        sort: {img.sort_order}
                                      </span>
                                      {img.is_primary && (
                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-extrabold text-emerald-700">
                                          Primary ✓
                                        </span>
                                      )}
                                    </div>
                                    <div className="truncate text-[11px] text-slate-500">
                                      {img.url}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {!img.is_primary && (
                                      <button
                                        type="button"
                                        onClick={() => onSetPrimary(img)}
                                        disabled={busy}
                                        className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
                                      >
                                        Set primary
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => onDeleteImage(img)}
                                      disabled={busy}
                                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-extrabold">Banners</h3>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                {banners.length} banner(s)
              </span>
            </div>

            <div className="p-4">
              {error && (
                <div className="text-sm font-bold text-red-600">
                  Failed to load banners. Check API base URL and token.
                </div>
              )}
              {isLoading && <p className="text-sm text-slate-600">Loading…</p>}

              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {["Title", "Active", "Window", "Images", "Order", "Updated", "Actions"].map(
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
                    {banners.map((b) => (
                      <tr key={b.id} className="border-b border-slate-50">
                        <td className="px-2 py-3">
                          <div className="font-extrabold">{b.title}</div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            #{b.id} • {b.description ? b.description.slice(0, 44) : "No description"}
                            {b.description && b.description.length > 44 ? "…" : ""}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          <span
                            className={[
                              "rounded-full border px-2.5 py-1 text-xs font-extrabold",
                              b.is_active
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-slate-50 text-slate-700",
                            ].join(" ")}
                          >
                            {b.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-600">
                          <div>Start: {b.starts_at ? new Date(b.starts_at).toLocaleString() : "—"}</div>
                          <div>End: {b.ends_at ? new Date(b.ends_at).toLocaleString() : "—"}</div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                            {(b.images ?? []).length}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-600">
                          {b.sort_order}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
                          {new Date(b.updated_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openEdit(b)}
                              disabled={busy}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteBanner(b)}
                              disabled={busy}
                              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                            >
                              {deleteMeta.isLoading ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!isLoading && banners.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-2 py-4 text-sm text-slate-500">
                          No banners found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 lg:hidden">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold">{b.title}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          #{b.id} • {(b.images ?? []).length} image(s)
                        </div>
                      </div>
                      <span
                        className={[
                          "rounded-full border px-2.5 py-1 text-xs font-extrabold",
                          b.is_active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-700",
                        ].join(" ")}
                      >
                        {b.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      {b.description ? b.description : "No description"}
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      <div>Start: {b.starts_at ? new Date(b.starts_at).toLocaleString() : "—"}</div>
                      <div>End: {b.ends_at ? new Date(b.ends_at).toLocaleString() : "—"}</div>
                      <div>Order: {b.sort_order}</div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => openEdit(b)}
                        disabled={busy}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteBanner(b)}
                        disabled={busy}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                      >
                        {deleteMeta.isLoading ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}

                {!isLoading && banners.length === 0 && (
                  <div className="text-sm text-slate-500">No banners found.</div>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-500">
                {busy ? "Working…" : `Showing ${banners.length} banner(s).`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}