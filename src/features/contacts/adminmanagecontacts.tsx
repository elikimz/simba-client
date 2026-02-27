// src/admin/AdminManageContact.tsx
import { useMemo, useState } from "react";
import {
  useAdminDeleteContactMutation,
  useAdminListContactsQuery,
  useAdminMarkReadMutation,
} from "../../features/contacts/contactsAPI";
import type { ContactResponse } from "../../features/contacts/contactsAPI";

const fmt = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const pill = (read: boolean) =>
  read
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-700";

const oneLine = (c: ContactResponse) => {
  const bits = [
    c.name?.trim() ? c.name.trim() : null,
    c.email?.trim() ? c.email.trim() : null,
    c.phone?.trim() ? c.phone.trim() : null,
  ].filter(Boolean);
  return bits.length ? bits.join(" • ") : "—";
};

function ContactModal({
  open,
  contact,
  onClose,
  onMarkRead,
  onDelete,
  busy,
}: {
  open: boolean;
  contact: ContactResponse | null;
  onClose: () => void;
  onMarkRead: (id: number, is_read: boolean) => void;
  onDelete: (id: number) => void;
  busy: boolean;
}) {
  if (!open || !contact) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* ✅ scrollable modal container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <div className="text-sm font-extrabold text-slate-900">
              Contact #{contact.id}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Created: {fmt(contact.created_at)} •{" "}
              <span
                className={[
                  "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-extrabold",
                  pill(!!contact.is_read),
                ].join(" ")}
              >
                {contact.is_read ? "READ" : "UNREAD"}
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

        {/* ✅ scroll area so it never “sticks” */}
        <div className="max-h-[75vh] overflow-auto p-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-xs font-extrabold text-slate-700">From</div>
            <div className="mt-1 text-sm font-extrabold text-slate-900">
              {contact.name?.trim() || "—"}
            </div>
            <div className="mt-0.5 text-sm text-slate-700">
              {contact.email?.trim() || "—"}
            </div>
            <div className="mt-0.5 text-sm text-slate-700">
              {contact.phone?.trim() || "—"}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-extrabold text-slate-700">Message</div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
              {contact.message}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              disabled={busy}
              onClick={() => onMarkRead(contact.id, true)}
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-extrabold text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
            >
              Mark as Read
            </button>

            <button
              disabled={busy}
              onClick={() => onMarkRead(contact.id, false)}
              className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-extrabold text-amber-800 hover:bg-amber-100 disabled:opacity-60"
            >
              Mark as Unread
            </button>

            <button
              disabled={busy}
              onClick={() => onDelete(contact.id)}
              className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-800 hover:bg-red-100 disabled:opacity-60"
            >
              Delete message
            </button>
          </div>

          <div className="mt-4 text-[11px] text-slate-500">
            Tip: click outside the box to close.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminManageContact() {
  const [query, setQuery] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<ContactResponse | null>(null);

  const { data, isLoading, isFetching, error, refetch } =
    useAdminListContactsQuery();

  const [markRead, markMeta] = useAdminMarkReadMutation();
  const [delContact, delMeta] = useAdminDeleteContactMutation();

  const busy = isLoading || isFetching || markMeta.isLoading || delMeta.isLoading;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const filtered = useMemo(() => {
    const list = (data ?? []) as ContactResponse[];
    const q = query.trim().toLowerCase();

    return list
      .filter((c) => (onlyUnread ? !c.is_read : true))
      .filter((c) => {
        if (!q) return true;
        const hay = [
          String(c.id),
          c.name ?? "",
          c.email ?? "",
          c.phone ?? "",
          c.message ?? "",
          c.is_read ? "read" : "unread",
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
  }, [data, query, onlyUnread]);

  const onMarkRead = async (id: number, is_read: boolean) => {
    try {
      const updated = await markRead({ contact_id: id, body: { is_read } }).unwrap();
      showToast(updated?.is_read ? "Marked as read." : "Marked as unread.");
      // keep modal open but update the selected state too
      setSelected((prev) => (prev?.id === id ? { ...prev, is_read } : prev));
    } catch (e: any) {
      showToast(
        String(
          e?.data?.detail || e?.error || e?.message || "Failed to update."
        )
      );
    }
  };

  const onDelete = async (id: number) => {
    const ok = window.confirm(`Delete contact #${id}? This can't be undone.`);
    if (!ok) return;

    try {
      await delContact(id).unwrap();
      showToast("Deleted.");
      if (selected?.id === id) setSelected(null);
    } catch (e: any) {
      showToast(
        String(
          e?.data?.detail || e?.error || e?.message || "Failed to delete."
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-indigo-100/50 via-sky-100/30 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Admin · Contacts
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Read messages from the website contact form.
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

        <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm md:grid-cols-[1fr_220px]">
          <label className="grid gap-1.5">
            <span className="text-xs font-extrabold text-slate-700">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, message…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(e) => setOnlyUnread(e.target.checked)}
              className="h-4 w-4 accent-indigo-600"
            />
            <span className="text-sm font-extrabold text-slate-700">
              Only unread
            </span>
          </label>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-extrabold">Messages</h3>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-extrabold text-slate-700">
              {busy ? "Working…" : `${filtered.length} message(s)`}
            </span>
          </div>

          <div className="p-4">
            {error && (
              <div className="text-sm font-bold text-red-600">
                Failed to load contacts. Check admin route + token.
              </div>
            )}
            {isLoading && (
              <p className="text-sm text-slate-600">Loading messages…</p>
            )}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    {["Status", "From", "Message", "Created", "Open"].map((h) => (
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
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50">
                      <td className="whitespace-nowrap px-2 py-3">
                        <span
                          className={[
                            "rounded-full border px-2.5 py-1 text-xs font-extrabold",
                            pill(!!c.is_read),
                          ].join(" ")}
                        >
                          {c.is_read ? "READ" : "UNREAD"}
                        </span>
                      </td>

                      <td className="px-2 py-3">
                        <div className="font-extrabold text-slate-900">
                          {c.name?.trim() || "—"}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {oneLine(c)}
                        </div>
                      </td>

                      <td className="px-2 py-3">
                        <div className="max-w-[560px] truncate text-sm text-slate-800">
                          {c.message}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
                        {fmt(c.created_at)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-3">
                        <button
                          onClick={() => setSelected(c)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold hover:bg-slate-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!isLoading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-2 py-4 text-sm text-slate-500">
                        No messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 lg:hidden">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        {c.name?.trim() || "—"}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {oneLine(c)} • {fmt(c.created_at)}
                      </div>
                    </div>

                    <span
                      className={[
                        "rounded-full border px-2.5 py-1 text-xs font-extrabold",
                        pill(!!c.is_read),
                      ].join(" ")}
                    >
                      {c.is_read ? "READ" : "UNREAD"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-slate-800 line-clamp-3">
                    {c.message}
                  </div>

                  <button
                    onClick={() => setSelected(c)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold hover:bg-slate-50"
                  >
                    View message
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        open={!!selected}
        contact={selected}
        onClose={() => setSelected(null)}
        onMarkRead={onMarkRead}
        onDelete={onDelete}
        busy={busy}
      />
    </div>
  );
}