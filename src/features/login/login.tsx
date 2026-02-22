// src/pages/Login.tsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLoginMutation } from "../register/registerAPI"; // ✅ adjust path if different
import Spinner from "../../components/layout/Spinner"; // ✅ adjust path if different

type FieldErrors = Partial<Record<"username" | "password", string>>;

type DecodedToken = {
  user_id?: number;
  user_role?: "user" | "admin" | string;
  exp?: number;
};

const DEV = import.meta.env.DEV;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(input: string) {
  const trimmed = input.trim();
  let cleaned = trimmed.replace(/[^\d+]/g, "");

  // 07XXXXXXXX -> +2547XXXXXXXX (Kenya-friendly)
  if (cleaned.startsWith("0") && cleaned.length >= 10) cleaned = "+254" + cleaned.slice(1);
  // 2547XXXXXXXX -> +2547XXXXXXXX
  if (/^\d+$/.test(cleaned) && cleaned.startsWith("254")) cleaned = "+" + cleaned;

  return cleaned;
}

function maybeNormalizeUsername(username: string) {
  const u = username.trim();
  if (!u) return u;
  if (u.includes("@")) return u.toLowerCase(); // email
  if (/\d/.test(u)) return normalizePhone(u); // phone-ish
  return u;
}

function getApiErrorMessage(err: unknown): string {
  const anyErr = err as any;
  const status = anyErr?.status ?? anyErr?.originalStatus;
  const data = anyErr?.data;

  if (DEV) {
    console.group("🚨 LOGIN API ERROR (Login)");
    console.log("Status:", status);
    console.log("Raw error:", anyErr);
    if (data) console.log("Response data:", data);
    console.groupEnd();
  }

  if (typeof data === "string") return data;
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;
  if (typeof anyErr?.error === "string") return anyErr.error;

  if (data?.detail && Array.isArray(data.detail)) {
    const msgs = data.detail
      .map((d: any) => d?.msg)
      .filter(Boolean)
      .slice(0, 3);
    if (msgs.length) return msgs.join(" • ");
  }

  if (status === "FETCH_ERROR") return "Network/CORS error. Check API URL and backend CORS.";
  return "Invalid email/phone or password.";
}

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const isEmail = useMemo(() => username.includes("@"), [username]);

  function validate(): boolean {
    const next: FieldErrors = {};
    const u = username.trim();
    const p = password;

    if (!u) next.username = "Email or phone is required.";
    else if (u.includes("@") && !EMAIL_RE.test(u.toLowerCase()))
      next.username = "Enter a valid email address.";

    if (!p) next.password = "Password is required.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    const payload = {
      username: maybeNormalizeUsername(username),
      password,
      grant_type: "password" as const,
    };

    if (DEV) {
      console.group("🟦 LOGIN REQUEST (Login)");
      console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);
      console.log("Payload:", { ...payload, password: "********" });
      console.groupEnd();
    }

    try {
      const res = await login(payload).unwrap();

      // ✅ store token
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("token_type", res.token_type);

      // ✅ decode and route by role
      let role: string | undefined;
      try {
        const decoded = jwtDecode<DecodedToken>(res.access_token);
        role = decoded?.user_role;
      } catch {
        role = undefined;
      }

      if (DEV) {
        console.group("🟩 LOGIN SUCCESS (Login)");
        console.log("Token type:", res.token_type);
        console.log("Decoded role:", role);
        console.groupEnd();
      }

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        // default route for normal users
        navigate("/user/dashboard");
      }
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use your email or phone number to access your account.
              </p>
            </div>

            {formError ? (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              >
                {formError}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <Input
                label="Email or phone"
                value={username}
                onChange={setUsername}
                placeholder={isEmail ? "you@example.com" : "e.g. +2547XXXXXXXX"}
                autoComplete="username"
                inputMode={isEmail ? "email" : "tel"}
                error={errors.username}
                disabled={isLoading}
              />

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                  Password
                </label>
                <div className="flex gap-2">
                  <input
                    className={[
                      "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none",
                      "placeholder:text-slate-400",
                      "focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100",
                      errors.password
                        ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                        : "border-slate-200",
                      isLoading ? "opacity-60" : "",
                    ].join(" ")}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    aria-invalid={Boolean(errors.password)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password ? (
                  <p className="mt-1.5 text-xs text-rose-700">{errors.password}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Spinner className="h-5 w-5 text-white" label="Signing in" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:underline">
                  Forgot password?
                </Link>

                <span className="text-slate-600">
                  New here?{" "}
                  <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
                    Create account
                  </Link>
                </span>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Having trouble signing in? Contact support if the issue persists.
          </p>
        </div>
      </div>
    </div>
  );
}

function Input(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  type?: string;
  error?: string;
  disabled?: boolean;
}) {
  const { label, value, onChange, placeholder, autoComplete, inputMode, type = "text", error, disabled } =
    props;

  const id = useMemo(() => `field-${label.toLowerCase().replace(/\s+/g, "-")}`, [label]);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-900">
        {label}
      </label>

      <input
        id={id}
        className={[
          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none",
          "placeholder:text-slate-400",
          "focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100",
          error ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100" : "border-slate-200",
          disabled ? "opacity-60" : "",
        ].join(" ")}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}