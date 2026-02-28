// src/pages/UserSetting.tsx  (or src/components/UserSetting.tsx)
import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { useChangePasswordMutation } from "../../features/settings/settingsAPI";

type ToastType = "success" | "error";
type Errors = Partial<
  Record<"old_password" | "new_password" | "confirm_password", string>
>;

function Field({
  label,
  required,
  icon,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold text-slate-700">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>
        {children}
      </div>
      {error ? (
        <span className="text-[11px] font-bold text-red-600">{error}</span>
      ) : null}
    </label>
  );
}

function Toast({
  toast,
  toastOpen,
  onClose,
}: {
  toast: { type: ToastType; msg: string } | null;
  toastOpen: boolean;
  onClose: () => void;
}) {
  if (!toast) return null;

  return (
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
            <div className="mt-0.5 break-words text-sm text-slate-700">
              {toast.msg}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserSetting() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toast, setToast] = useState<{ type: ToastType; msg: string } | null>(
    null
  );
  const [toastOpen, setToastOpen] = useState(false);

  const [changePassword, meta] = useChangePasswordMutation();
  const busy = meta.isLoading;

  const showToast = (type: ToastType, msg: string) => {
    setToast({ type, msg });
    setToastOpen(true);
  };
  const closeToast = () => setToastOpen(false);

  useEffect(() => {
    if (!toast || !toastOpen) return;
    const t = window.setTimeout(() => setToastOpen(false), 2600);
    return () => window.clearTimeout(t);
  }, [toast, toastOpen]);

  useEffect(() => {
    if (!toast) return;
    if (toastOpen) return;
    const t = window.setTimeout(() => setToast(null), 220);
    return () => window.clearTimeout(t);
  }, [toast, toastOpen]);

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    const oldP = form.old_password.trim();
    const newP = form.new_password.trim();
    const conf = form.confirm_password.trim();

    if (!oldP) e.old_password = "Current password is required.";
    if (!newP) e.new_password = "New password is required.";
    if (!conf) e.confirm_password = "Please confirm your new password.";

    if (newP && newP.length < 8) e.new_password = "Use at least 8 characters.";
    if (newP && oldP && newP === oldP)
      e.new_password = "New password must be different.";
    if (newP && conf && newP !== conf)
      e.confirm_password = "Passwords do not match.";

    return e;
  };

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors]
  );

  const submit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      showToast("error", "Fix the highlighted fields.");
      return;
    }

    try {
      const res = await changePassword({
        old_password: form.old_password,
        new_password: form.new_password,
      }).unwrap();

      showToast("success", res?.message || "Password updated successfully.");
      setForm({ old_password: "", new_password: "", confirm_password: "" });
      setErrors({});
    } catch (e: any) {
      const msg = String(
        e?.data?.detail ||
          e?.data?.message ||
          e?.error ||
          e?.message ||
          "Failed to change password."
      );
      showToast("error", msg);
    }
  };

  const inputBase =
    "w-full rounded-xl border bg-white pl-10 pr-10 py-2 text-sm outline-none transition focus:ring-4";
  const ok = "border-slate-200 focus:border-fuchsia-300 focus:ring-fuchsia-100";
  const bad = "border-red-300 focus:border-red-400 focus:ring-red-100";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toast toast={toast} toastOpen={toastOpen} onClose={closeToast} />

      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-fuchsia-100/50 via-pink-100/30 to-transparent" />

      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold tracking-tight">Security</h1>
              <p className="mt-1 text-sm text-slate-600">
                Change your account password.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-50 px-2 py-1 text-xs font-semibold text-fuchsia-900">
              <ShieldCheck className="h-3.5 w-3.5" />
              Settings
            </span>
          </div>

          <div className="px-6 py-6">
            <div className="grid gap-4">
              <Field
                label="Current password"
                required
                icon={<KeyRound className="h-4 w-4" />}
                error={errors.old_password}
              >
                <input
                  type={showOld ? "text" : "password"}
                  value={form.old_password}
                  onChange={(e) => onChange("old_password", e.target.value)}
                  placeholder="Enter current password"
                  className={`${inputBase} ${errors.old_password ? bad : ok}`}
                  aria-invalid={!!errors.old_password}
                />
                <button
                  type="button"
                  onClick={() => setShowOld((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showOld ? "Hide password" : "Show password"}
                >
                  {showOld ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </Field>

              <Field
                label="New password"
                required
                icon={<KeyRound className="h-4 w-4" />}
                error={errors.new_password}
              >
                <input
                  type={showNew ? "text" : "password"}
                  value={form.new_password}
                  onChange={(e) => onChange("new_password", e.target.value)}
                  placeholder="Enter new password"
                  className={`${inputBase} ${errors.new_password ? bad : ok}`}
                  aria-invalid={!!errors.new_password}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </Field>

              <Field
                label="Confirm new password"
                required
                icon={<KeyRound className="h-4 w-4" />}
                error={errors.confirm_password}
              >
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm_password}
                  onChange={(e) => onChange("confirm_password", e.target.value)}
                  placeholder="Repeat new password"
                  className={`${inputBase} ${errors.confirm_password ? bad : ok}`}
                  aria-invalid={!!errors.confirm_password}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </Field>

              <button
                type="button"
                onClick={submit}
                disabled={busy || hasErrors}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-fuchsia-600 to-fuchsia-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-fuchsia-700 hover:to-fuchsia-800 disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4" />
                {busy ? "Updating…" : "Update password"}
              </button>

              <p className="text-[11px] text-slate-500">
                Tip: Use 8+ characters and avoid reusing old passwords.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}