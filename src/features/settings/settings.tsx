// src/pages/ForgotPassword.tsx
import React from "react";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../features/settings/settingsAPI";
import { useNavigate } from "react-router-dom";

type Banner = { type: "success" | "error"; message: string } | null;

function BannerBox({ banner }: { banner: Banner }) {
  if (!banner) return null;

  const base =
    "rounded-2xl border px-4 py-3 text-sm font-semibold flex items-start gap-2";
  const styles =
    banner.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className={`${base} ${styles}`}>
      <span className="mt-0.5">{banner.type === "success" ? "✅" : "⚠️"}</span>
      <div className="leading-relaxed">{banner.message}</div>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs font-semibold text-rose-700">{msg}</p>;
}

function passwordScore(pw: string) {
  const s = pw.trim();
  let score = 0;
  if (s.length >= 8) score += 1;
  if (s.length >= 12) score += 1;
  if (/[A-Z]/.test(s)) score += 1;
  if (/[a-z]/.test(s)) score += 1;
  if (/\d/.test(s)) score += 1;
  if (/[^A-Za-z0-9]/.test(s)) score += 1;
  return Math.min(score, 5);
}

function PasswordStrength({ value }: { value: string }) {
  const s = passwordScore(value);
  const label =
    s <= 1 ? "Weak" : s === 2 ? "Okay" : s === 3 ? "Good" : "Strong";

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">
          Password strength
        </span>
        <span className="text-xs font-extrabold text-gray-800">{label}</span>
      </div>

      <div className="mt-2 grid grid-cols-5 gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={[
              "h-1.5 rounded-full",
              i < s ? "bg-gray-900" : "bg-gray-200",
            ].join(" ")}
          />
        ))}
      </div>

      <p className="mt-2 text-[11px] font-semibold text-gray-600">
        Use 8+ characters. Mix numbers and symbols for stronger security.
      </p>
    </div>
  );
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = React.useState<1 | 2>(1);

  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [resetToken, setResetToken] = React.useState("");

  const [banner, setBanner] = React.useState<Banner>(null);

  const [errors, setErrors] = React.useState<{
    email?: string;
    code?: string;
    newPassword?: string;
  }>({});

  const [forgotPassword, { isLoading: sending }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  // -----------------------------
  // RESEND COOLDOWN
  // -----------------------------
  const RESEND_SECONDS = 45;
  const [resendLeft, setResendLeft] = React.useState(0);

  React.useEffect(() => {
    if (resendLeft <= 0) return;
    const t = setInterval(() => setResendLeft((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendLeft]);

  function startCooldown() {
    setResendLeft(RESEND_SECONDS);
  }

  function validateStep1() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!isEmail(email)) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!isEmail(email)) next.email = "Enter a valid email address.";

    if (!code.trim()) next.code = "Reset code is required.";
    else if (!/^\d{6}$/.test(code.trim())) next.code = "Code must be 6 digits.";

    if (!newPassword.trim()) next.newPassword = "New password is required.";
    else if (newPassword.trim().length < 8)
      next.newPassword = "Password must be at least 8 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function resetMessages() {
    setBanner(null);
    setErrors({});
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();

    if (!validateStep1()) return;

    try {
      const res = await forgotPassword({ email: email.trim() }).unwrap();
      setResetToken(res.reset_token);
      setStep(2);

      setBanner({
        type: "success",
        message:
          "Code sent. Check your email for the 6-digit reset code. You can resend after the timer ends.",
      });

      startCooldown();
    } catch (err: any) {
      setBanner({
        type: "error",
        message: err?.data?.detail || "Failed to send reset code. Please try again.",
      });
    }
  }

  async function handleResend() {
    resetMessages();

    if (!validateStep1()) return;
    if (resendLeft > 0 || sending) return;

    try {
      const res = await forgotPassword({ email: email.trim() }).unwrap();
      setResetToken(res.reset_token);

      setBanner({
        type: "success",
        message: "A new reset code has been sent to your email.",
      });

      startCooldown();
    } catch (err: any) {
      setBanner({
        type: "error",
        message: err?.data?.detail || "Failed to resend code. Please try again.",
      });
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();

    if (!validateStep2()) return;

    try {
      await resetPassword({
        email: email.trim(),
        code: code.trim(),
        new_password: newPassword,
        reset_token: resetToken,
      }).unwrap();

      setBanner({
        type: "success",
        message: "Password updated successfully. Redirecting to sign in…",
      });

      setTimeout(() => navigate("/login"), 900);
    } catch (err: any) {
      setBanner({
        type: "error",
        message:
          err?.data?.detail ||
          "Reset failed. Invalid code or expired token. Try resending the code.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6">
        <h1 className="text-lg font-extrabold text-gray-900">Forgot Password</h1>
        <p className="mt-1 text-sm text-gray-600">
          {step === 1
            ? "Enter your email to receive a reset code."
            : "Enter the code and choose a new password."}
        </p>

        <div className="mt-5">
          <BannerBox banner={banner} />
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700">Email</label>
              <input
                type="email"
                className={[
                  "mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-gray-300",
                  errors.email ? "border-rose-300" : "border-gray-200",
                ].join(" ")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="Enter your email"
                required
              />
              <FieldError msg={errors.email} />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-black disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700">Email</label>
              <input
                type="email"
                className={[
                  "mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-gray-300",
                  errors.email ? "border-rose-300" : "border-gray-200",
                ].join(" ")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="Confirm your email"
                required
              />
              <FieldError msg={errors.email} />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">Reset code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className={[
                  "mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-gray-300",
                  errors.code ? "border-rose-300" : "border-gray-200",
                ].join(" ")}
                value={code}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(v);
                  if (errors.code) setErrors((p) => ({ ...p, code: undefined }));
                }}
                placeholder="Enter 6-digit code"
                required
              />
              <FieldError msg={errors.code} />

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500">
                  Didn’t get the code?
                </span>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLeft > 0 || sending}
                  className="text-[11px] font-extrabold text-gray-900 hover:underline disabled:opacity-50"
                >
                  {resendLeft > 0 ? `Resend in ${resendLeft}s` : sending ? "Sending…" : "Resend code"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">New password</label>
              <input
                type="password"
                className={[
                  "mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-gray-300",
                  errors.newPassword ? "border-rose-300" : "border-gray-200",
                ].join(" ")}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword)
                    setErrors((p) => ({ ...p, newPassword: undefined }));
                }}
                placeholder="New password"
                required
              />
              <FieldError msg={errors.newPassword} />
              <PasswordStrength value={newPassword} />
            </div>

            <button
              type="submit"
              disabled={resetting}
              className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-black disabled:opacity-60"
            >
              {resetting ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setBanner(null);
                setErrors({});
                setCode("");
                setNewPassword("");
              }}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}