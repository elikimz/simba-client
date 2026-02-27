// src/admin/AdminManageCategories.tsx
import { useMemo, useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useListCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../features/categories/catagoriesAPI";
import type {
  CategoryCreateInput,
  CategoryResponse,
  CategoryUpdateInput,
} from "../../features/categories/catagoriesAPI";

type FormMode = "create" | "edit";

type CategoryFormState = {
  name: string;
  description: string;
};

const emptyForm = (): CategoryFormState => ({
  name: "",
  description: "",
});

function toCreatePayload(s: CategoryFormState): CategoryCreateInput {
  return {
    name: s.name.trim(),
    description: s.description.trim() ? s.description.trim() : null,
  };
}

function toUpdatePayload(s: CategoryFormState): CategoryUpdateInput {
  // keep it safe for PUT: send full fields
  return {
    name: s.name.trim(),
    description: s.description.trim() ? s.description.trim() : null,
  };
}

function fromCategory(c: CategoryResponse): CategoryFormState {
  return {
    name: c.name ?? "",
    description: c.description ?? "",
  };
}

function isValid(s: CategoryFormState): string | null {
  if (!s.name.trim()) return "Category name is required.";
  if (s.name.trim().length < 2) return "Category name is too short.";
  return null;
}

export default function AdminManageCategories() {
  const { data, isLoading, isFetching, error, refetch } =
    useListCategoriesQuery();

  const [createCategory, createMeta] = useCreateCategoryMutation();
  const [updateCategory, updateMeta] = useUpdateCategoryMutation();
  const [deleteCategory, deleteMeta] = useDeleteCategoryMutation();

  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<FormMode>("create");
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm());
  const [toast, setToast] = useState<string | null>(null);

  const busy =
    isLoading ||
    isFetching ||
    createMeta.isLoading ||
    updateMeta.isLoading ||
    deleteMeta.isLoading;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const onChange = (key: keyof CategoryFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetToCreate = () => {
    setMode("create");
    setEditing(null);
    setForm(emptyForm());
  };

  const openEdit = (c: CategoryResponse) => {
    setMode("edit");
    setEditing(c);
    setForm(fromCategory(c));
    window.setTimeout(() => {
      document
        .getElementById("category-form-card")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((c) => {
      const name = c.name?.toLowerCase() ?? "";
      const desc = c.description?.toLowerCase() ?? "";
      return name.includes(q) || desc.includes(q);
    });
  }, [data, query]);

  const submit = async () => {
    const errMsg = isValid(form);
    if (errMsg) {
      showToast(errMsg);
      return;
    }

    try {
      if (mode === "create") {
        await createCategory(toCreatePayload(form)).unwrap();
        showToast("Category created.");
        setForm(emptyForm());
      } else {
        if (!editing) return;
        await updateCategory({
          category_id: editing.id,
          body: toUpdatePayload(form),
        }).unwrap();
        showToast("Category updated.");
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

  const onDelete = async (c: CategoryResponse) => {
    const ok = window.confirm(
      `Delete category "${c.name}"? This can't be undone.`
    );
    if (!ok) return;

    try {
      await deleteCategory(c.id).unwrap();
      showToast("Category deleted.");
      if (editing?.id === c.id) resetToCreate();
    } catch (e: any) {
      const msg =
        e?.data?.detail ||
        e?.error ||
        e?.message ||
        "Failed to delete. Check your API and token.";
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
              Admin · Categories
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Create, edit, and delete product categories.
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
            id="category-form-card"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-extrabold">
                {mode === "create"
                  ? "Create category"
                  : `Edit category #${editing?.id}`}
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
                  Required: name
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="grid gap-3">
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-700">
                    Name *
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    placeholder="e.g. Sneakers"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
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
                    rows={4}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <button
                  onClick={submit}
                  disabled={busy}
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-60"
                >
                  {mode === "create"
                    ? createMeta.isLoading
                      ? "Creating…"
                      : "Create category"
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
              <h3 className="text-sm font-extrabold">All categories</h3>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name / description…"
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="p-4">
              {isLoading && <p className="text-sm text-slate-600">Loading…</p>}
              {error && (
                <div className="text-sm font-bold text-red-600">
                  Failed to load categories. Check API base URL and token.
                </div>
              )}

              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {["Name", "Description", "Updated", "Actions"].map((h) => (
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
                    {(filtered ?? []).map((c) => (
                      <tr key={c.id} className="border-b border-slate-50">
                        <td className="px-2 py-3">
                          <div className="font-extrabold">{c.name}</div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            #{c.id}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="text-sm text-slate-700">
                            {c.description ? c.description : "—"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
                          {/* categories API doesn't include updated_at in your type */}
                          —
                        </td>
                        <td className="whitespace-nowrap px-2 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openEdit(c)}
                              disabled={busy}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(c)}
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
                          colSpan={4}
                          className="px-2 py-4 text-sm text-slate-500"
                        >
                          No categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 lg:hidden">
                {(filtered ?? []).map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold">{c.name}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          #{c.id}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          disabled={busy}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50 disabled:opacity-60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(c)}
                          disabled={busy}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:opacity-60"
                        >
                          {deleteMeta.isLoading ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      {c.description ? c.description : "—"}
                    </div>
                  </div>
                ))}

                {!isLoading && (filtered?.length ?? 0) === 0 && (
                  <div className="text-sm text-slate-500">No categories found.</div>
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