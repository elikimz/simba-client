// src/pages/UserContacts.tsx  (or src/components/UserContacts.tsx)
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useCreateContactMutation } from "../../features/contacts/contactsAPI";
import type { ContactCreateInput } from "../../features/contacts/contactsAPI";

type Errors = Partial<Record<keyof ContactCreateInput, string>>;
type ToastType = "success" | "error";

export default function UserContacts() {
  const [form, setForm] = useState<ContactCreateInput>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const [toast, setToast] = useState<{ type: ToastType; msg: string } | null>(
    null
  );
  const [toastOpen, setToastOpen] = useState(false);

  const [createContact, meta] = useCreateContactMutation();
  const busy = meta.isLoading;

  const showToast = (type: ToastType, msg: string) => {
    setToast({ type, msg });
    setToastOpen(true);
  };

  const closeToast = () => setToastOpen(false);

  // slide-out then remove
  useEffect(() => {
    if (!toast || !toastOpen) return;

    const t1 = window.setTimeout(() => setToastOpen(false), 2600);
    return () => window.clearTimeout(t1);
  }, [toast, toastOpen]);

  useEffect(() => {
    if (!toast) return;
    if (toastOpen) return;

    const t2 = window.setTimeout(() => setToast(null), 220);
    return () => window.clearTimeout(t2);
  }, [toast, toastOpen]);

  const onChange = (key: keyof ContactCreateInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (data: ContactCreateInput): Errors => {
    const e: Errors = {};
    const name = data.name?.trim() ?? "";
    const email = data.email?.trim() ?? "";
    const phone = data.phone?.trim() ?? "";
    const message = data.message?.trim() ?? "";

    if (!name) e.name = "Name is required.";
    if (!phone) e.phone = "Phone is required.";
    if (!email) e.email = "Email is required.";
    if (!message) e.message = "Message is required.";

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Enter a valid email address.";
    }

    if (phone && phone.replace(/\D/g, "").length < 7) {
      e.phone = "Enter a valid phone number.";
    }

    return e;
  };

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors]
  );

  const submit = async () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      showToast("error", "Please fix the highlighted fields.");
      return;
    }

    try {
      await createContact({
        name: (form.name ?? "").trim(),
        email: (form.email ?? "").trim(),
        phone: (form.phone ?? "").trim(),
        message: (form.message ?? "").trim(),
      }).unwrap();

      showToast("success", "Message sent. Thank you!");
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch (e: any) {
      const msg = String(
        e?.data?.detail ||
          e?.data?.message ||
          e?.error ||
          e?.message ||
          "Failed to send message."
      );
      showToast("error", msg);
    }
  };

  const Field = ({
    label,
    required,
    children,
    error,
  }: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
  }) => (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold text-slate-700">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-[11px] font-bold text-red-600">{error}</span>
      ) : null}
    </label>
  );

  const inputBase =
    "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:ring-4";
  const ok = "border-slate-200 focus:border-fuchsia-300 focus:ring-fuchsia-100";
  const bad = "border-red-300 focus:border-red-400 focus:ring-red-100";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top-right SaaS toast */}
      {toast && (
        <div className="fixed right-5 top-5 z-50">
          <div
            role="status"
            aria-live="polite"
            className={[
              "w-[min(92vw,420px)] overflow-hidden rounded-2xl border shadow-lg",
              "bg-white/95 backdrop-blur",
              "transition-all duration-200 ease-out",
              toastOpen
                ? "opacity-100 translate-y-0 translate-x-0"
                : "opacity-0 translate-y-1 translate-x-2",
              toast.type === "success" ? "border-emerald-200" : "border-red-200",
            ].join(" ")}
          >
            {/* accent bar */}
            <div
              className={[
                "h-1.5 w-full",
                toast.type === "success" ? "bg-emerald-500" : "bg-red-500",
              ].join(" ")}
            />
            <div className="flex items-start gap-3 px-4 py-3">
              <div className="mt-0.5">
                {toast.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={[
                    "text-sm font-extrabold",
                    toast.type === "success"
                      ? "text-emerald-900"
                      : "text-red-900",
                  ].join(" ")}
                >
                  {toast.type === "success" ? "Success" : "Something went wrong"}
                </div>
                <div className="mt-0.5 text-sm text-slate-700 break-words">
                  {toast.msg}
                </div>
              </div>

              <button
                type="button"
                onClick={closeToast}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-fuchsia-100/50 via-pink-100/30 to-transparent" />

      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h1 className="text-xl font-extrabold tracking-tight">Contact us</h1>
            <p className="mt-1 text-sm text-slate-600">
              Send us a message and we’ll get back to you.
            </p>
          </div>

          <div className="px-6 py-6">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required error={errors.name}>
                  <input
                    value={form.name ?? ""}
                    onChange={(e) => onChange("name", e.target.value)}
                    placeholder="Your name"
                    className={`${inputBase} ${errors.name ? bad : ok}`}
                    aria-invalid={!!errors.name}
                  />
                </Field>

                <Field label="Phone" required error={errors.phone}>
                  <input
                    value={form.phone ?? ""}
                    onChange={(e) => onChange("phone", e.target.value)}
                    placeholder="Your phone"
                    className={`${inputBase} ${errors.phone ? bad : ok}`}
                    aria-invalid={!!errors.phone}
                  />
                </Field>
              </div>

              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputBase} ${errors.email ? bad : ok}`}
                  aria-invalid={!!errors.email}
                />
              </Field>

              <Field label="Message" required error={errors.message}>
                <textarea
                  value={form.message ?? ""}
                  onChange={(e) => onChange("message", e.target.value)}
                  placeholder="Write your message…"
                  rows={6}
                  className={`w-full resize-y rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:ring-4 ${
                    errors.message ? bad : ok
                  }`}
                  aria-invalid={!!errors.message}
                />
              </Field>

              <button
                type="button"
                onClick={submit}
                disabled={busy || hasErrors}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-fuchsia-600 to-fuchsia-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-fuchsia-700 hover:to-fuchsia-800 disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send message"}
              </button>

              <p className="text-[11px] text-slate-500">
                All fields are required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}