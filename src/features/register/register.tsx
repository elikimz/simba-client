// // src/pages/RegisterPage.tsx
// import React, { useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useRegisterMutation } from "../register/registerAPI";
// import Spinner from "../../components/layout/Spinner";
// type FieldErrors = Partial<
//   Record<"name" | "email" | "phone" | "password" | "confirmPassword", string>
// >;

// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const DEV = import.meta.env.DEV;

// function normalizePhone(input: string) {
//   const trimmed = input.trim();
//   let cleaned = trimmed.replace(/[^\d+]/g, "");

//   if (cleaned.startsWith("0") && cleaned.length >= 10) cleaned = "+254" + cleaned.slice(1);
//   if (/^\d+$/.test(cleaned) && cleaned.startsWith("254")) cleaned = "+" + cleaned;

//   return cleaned;
// }

// function getApiErrorMessage(err: unknown): string {
//   const anyErr = err as any;
//   const status = anyErr?.status ?? anyErr?.originalStatus;
//   const data = anyErr?.data;

//   if (DEV) {
//     console.group("🚨 REGISTER API ERROR (RegisterPage)");
//     console.log("Status:", status);
//     console.log("Raw error:", anyErr);
//     if (data) {
//       console.log("Response data:", data);
//       if (Array.isArray(data?.detail)) {
//         console.group("🧾 FastAPI Validation Errors (422)");
//         data.detail.forEach((d: any) => {
//           const loc = Array.isArray(d?.loc) ? d.loc.join(".") : String(d?.loc ?? "");
//           console.log(`${loc} → ${d?.msg}`);
//         });
//         console.groupEnd();
//       }
//     }
//     console.groupEnd();
//   }

//   if (typeof data === "string") return data;

//   if (data?.detail && Array.isArray(data.detail)) {
//     const msgs = data.detail
//       .map((d: any) => d?.msg)
//       .filter(Boolean)
//       .slice(0, 3);
//     if (msgs.length) return msgs.join(" • ");
//   }

//   if (typeof data?.detail === "string") return data.detail;
//   if (typeof data?.message === "string") return data.message;
//   if (typeof anyErr?.error === "string") return anyErr.error;

//   if (status === "FETCH_ERROR") return "Network/CORS error. Check API URL and backend CORS.";
//   return "Something went wrong. Please try again.";
// }

// export default function RegisterPage() {
//   const navigate = useNavigate();
//   const [register, { isLoading }] = useRegisterMutation();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [acceptTerms, setAcceptTerms] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const [errors, setErrors] = useState<FieldErrors>({});
//   const [formError, setFormError] = useState<string | null>(null);

//   const passwordStrength = useMemo(() => {
//     const p = password;
//     let score = 0;
//     if (p.length >= 8) score++;
//     if (/[A-Z]/.test(p)) score++;
//     if (/[a-z]/.test(p)) score++;
//     if (/\d/.test(p)) score++;
//     if (/[^A-Za-z0-9]/.test(p)) score++;

//     const label =
//       score <= 2 ? "Weak" : score === 3 ? "Okay" : score === 4 ? "Good" : "Strong";
//     const percent = Math.min(100, Math.max(0, Math.round((score / 5) * 100)));
//     return { score, label, percent };
//   }, [password]);

//   function validate(): boolean {
//     const next: FieldErrors = {};
//     const n = name.trim();
//     const e = email.trim().toLowerCase();
//     const p = normalizePhone(phone);

//     if (!n) next.name = "Name is required.";
//     if (!e) next.email = "Email is required.";
//     else if (!EMAIL_RE.test(e)) next.email = "Enter a valid email address.";

//     if (!p) next.phone = "Phone number is required.";
//     else if (p.length < 10) next.phone = "Enter a valid phone number.";

//     if (!password) next.password = "Password is required.";
//     else if (password.length < 8) next.password = "Password must be at least 8 characters.";

//     if (!confirmPassword) next.confirmPassword = "Please confirm your password.";
//     else if (confirmPassword !== password) next.confirmPassword = "Passwords do not match.";

//     if (!acceptTerms) setFormError("Please accept the terms to continue.");
//     else setFormError(null);

//     setErrors(next);
//     return Object.keys(next).length === 0 && acceptTerms;
//   }

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setFormError(null);

//     if (!validate()) return;

//     const payload = {
//       name: name.trim(),
//       email: email.trim().toLowerCase(),
//       phone: normalizePhone(phone),
//       password,
//     };

//     if (DEV) {
//       console.group("🟦 REGISTER REQUEST (RegisterPage)");
//       console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);
//       console.log("Payload:", payload);
//       console.groupEnd();
//     }

//     try {
//       const res = await register(payload).unwrap();

//       if (DEV) {
//         console.group("🟩 REGISTER SUCCESS (RegisterPage)");
//         console.log("Response:", res);
//         console.groupEnd();
//       }

//       localStorage.setItem("access_token", res.access_token);
//       localStorage.setItem("token_type", res.token_type);

//       navigate("/");
//     } catch (err) {
//       setFormError(getApiErrorMessage(err));
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
//         <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
//       </div>

//       <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
//         <div className="w-full max-w-lg">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//             <div className="mb-6">
//               {/* ✅ Removed "Your App" row and removed the subtitle line */}
//               <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//                 Create your account
//               </h1>
//             </div>

//             {formError ? (
//               <div
//                 role="alert"
//                 className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
//               >
//                 {formError}
//               </div>
//             ) : null}

//             <form onSubmit={onSubmit} className="space-y-5" noValidate>
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <Input
//                   label="Full name"
//                   value={name}
//                   onChange={setName}
//                   placeholder="e.g. Wairimu Kimani"
//                   autoComplete="name"
//                   error={errors.name}
//                   disabled={isLoading}
//                 />

//                 <Input
//                   label="Email"
//                   value={email}
//                   onChange={setEmail}
//                   placeholder="you@example.com"
//                   autoComplete="email"
//                   inputMode="email"
//                   error={errors.email}
//                   disabled={isLoading}
//                 />

//                 <Input
//                   label="Phone"
//                   value={phone}
//                   onChange={setPhone}
//                   placeholder="e.g. +2547XXXXXXXX"
//                   autoComplete="tel"
//                   inputMode="tel"
//                   error={errors.phone}
//                   disabled={isLoading}
//                 />

//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-semibold text-slate-900">
//                     Password
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       className={[
//                         "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none",
//                         "placeholder:text-slate-400",
//                         "focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100",
//                         errors.password
//                           ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
//                           : "border-slate-200",
//                         isLoading ? "opacity-60" : "",
//                       ].join(" ")}
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Create a password"
//                       autoComplete="new-password"
//                       disabled={isLoading}
//                       aria-invalid={Boolean(errors.password)}
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((s) => !s)}
//                       className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
//                       disabled={isLoading}
//                       aria-label={showPassword ? "Hide password" : "Show password"}
//                     >
//                       {showPassword ? "Hide" : "Show"}
//                     </button>
//                   </div>

//                   <div className="mt-3 flex items-center gap-3">
//                     <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
//                       <div
//                         className={[
//                           "h-full rounded-full transition-all",
//                           passwordStrength.score <= 2
//                             ? "bg-rose-500"
//                             : passwordStrength.score === 3
//                             ? "bg-amber-500"
//                             : "bg-emerald-500",
//                         ].join(" ")}
//                         style={{ width: `${passwordStrength.percent}%` }}
//                       />
//                     </div>
//                     <span className="min-w-14 text-right text-xs font-medium text-slate-600">
//                       {passwordStrength.label}
//                     </span>
//                   </div>

//                   {errors.password ? (
//                     <p className="mt-1.5 text-xs text-rose-700">{errors.password}</p>
//                   ) : (
//                     <p className="mt-1.5 text-xs text-slate-500">
//                       Use 8+ characters. Add numbers/symbols for a stronger password.
//                     </p>
//                   )}
//                 </div>

//                 <Input
//                   label="Confirm password"
//                   value={confirmPassword}
//                   onChange={setConfirmPassword}
//                   placeholder="Re-enter your password"
//                   autoComplete="new-password"
//                   type={showPassword ? "text" : "password"}
//                   error={errors.confirmPassword}
//                   disabled={isLoading}
//                   className="sm:col-span-2"
//                 />
//               </div>

//               <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
//                 <input
//                   type="checkbox"
//                   checked={acceptTerms}
//                   onChange={(e) => setAcceptTerms(e.target.checked)}
//                   disabled={isLoading}
//                   className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
//                 />
//                 <span className="text-sm text-slate-700">
//                   I agree to the{" "}
//                   <Link to="/terms" className="font-semibold text-indigo-600 hover:underline">
//                     Terms
//                   </Link>{" "}
//                   and{" "}
//                   <Link to="/privacy" className="font-semibold text-indigo-600 hover:underline">
//                     Privacy Policy
//                   </Link>
//                   .
//                 </span>
//               </label>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-60"
//               >
//                 {isLoading ? (
//                   <span className="inline-flex items-center justify-center gap-2">
//                     <Spinner className="h-5 w-5" />
//                     Creating account...
//                   </span>
//                 ) : (
//                   "Create account"
//                 )}
//               </button>

//               <p className="text-center text-sm text-slate-600">
//                 Already have an account?{" "}
//                 <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
//                   Sign in
//                 </Link>
//               </p>
//             </form>
//           </div>

//           <p className="mt-6 text-center text-xs text-slate-500">
//             By continuing, you acknowledge that you have read and understood our policies.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Input(props: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
//   autoComplete?: string;
//   inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
//   type?: string;
//   error?: string;
//   disabled?: boolean;
//   className?: string;
// }) {
//   const {
//     label,
//     value,
//     onChange,
//     placeholder,
//     autoComplete,
//     inputMode,
//     type = "text",
//     error,
//     disabled,
//     className,
//   } = props;

//   const id = useMemo(() => `field-${label.toLowerCase().replace(/\s+/g, "-")}`, [label]);

//   return (
//     <div className={className}>
//       <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-900">
//         {label}
//       </label>

//       <input
//         id={id}
//         className={[
//           "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none",
//           "placeholder:text-slate-400",
//           "focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100",
//           error ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100" : "border-slate-200",
//           disabled ? "opacity-60" : "",
//         ].join(" ")}
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         autoComplete={autoComplete}
//         inputMode={inputMode}
//         disabled={disabled}
//         aria-invalid={Boolean(error)}
//         aria-describedby={error ? `${id}-error` : undefined}
//       />

//       {error ? (
//         <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-700">
//           {error}
//         </p>
//       ) : null}
//     </div>
//   );
// }







// src/pages/RegisterPage.tsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../register/registerAPI";
import Spinner from "../../components/layout/Spinner";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "password" | "confirmPassword", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEV = import.meta.env.DEV;

function normalizePhone(input: string) {
  const trimmed = input.trim();
  let cleaned = trimmed.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("0") && cleaned.length >= 10) cleaned = "+254" + cleaned.slice(1);
  if (/^\d+$/.test(cleaned) && cleaned.startsWith("254")) cleaned = "+" + cleaned;

  return cleaned;
}

function getApiErrorMessage(err: unknown): string {
  const anyErr = err as any;
  const status = anyErr?.status ?? anyErr?.originalStatus;
  const data = anyErr?.data;

  if (DEV) {
    console.group("🚨 REGISTER API ERROR (RegisterPage)");
    console.log("Status:", status);
    console.log("Raw error:", anyErr);
    if (data) {
      console.log("Response data:", data);
      if (Array.isArray(data?.detail)) {
        console.group("🧾 FastAPI Validation Errors (422)");
        data.detail.forEach((d: any) => {
          const loc = Array.isArray(d?.loc) ? d.loc.join(".") : String(d?.loc ?? "");
          console.log(`${loc} → ${d?.msg}`);
        });
        console.groupEnd();
      }
    }
    console.groupEnd();
  }

  if (typeof data === "string") return data;

  if (data?.detail && Array.isArray(data.detail)) {
    const msgs = data.detail
      .map((d: any) => d?.msg)
      .filter(Boolean)
      .slice(0, 3);
    if (msgs.length) return msgs.join(" • ");
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;
  if (typeof anyErr?.error === "string") return anyErr.error;

  if (status === "FETCH_ERROR") return "Network/CORS error. Check API URL and backend CORS.";
  return "Something went wrong. Please try again.";
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    const p = password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    const label =
      score <= 2 ? "Weak" : score === 3 ? "Okay" : score === 4 ? "Good" : "Strong";
    const percent = Math.min(100, Math.max(0, Math.round((score / 5) * 100)));
    return { score, label, percent };
  }, [password]);

  function validate(): boolean {
    const next: FieldErrors = {};
    const n = name.trim();
    const e = email.trim().toLowerCase();
    const p = normalizePhone(phone);

    if (!n) next.name = "Name is required.";
    if (!e) next.email = "Email is required.";
    else if (!EMAIL_RE.test(e)) next.email = "Enter a valid email address.";

    if (!p) next.phone = "Phone number is required.";
    else if (p.length < 10) next.phone = "Enter a valid phone number.";

    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Password must be at least 8 characters.";

    if (!confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password) next.confirmPassword = "Passwords do not match.";

    if (!acceptTerms) setFormError("Please accept the terms to continue.");
    else setFormError(null);

    setErrors(next);
    return Object.keys(next).length === 0 && acceptTerms;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: normalizePhone(phone),
      password,
    };

    if (DEV) {
      console.group("🟦 REGISTER REQUEST (RegisterPage)");
      console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);
      console.log("Payload:", payload);
      console.groupEnd();
    }

    try {
      const res = await register(payload).unwrap();

      if (DEV) {
        console.group("🟩 REGISTER SUCCESS (RegisterPage)");
        console.log("Response:", res);
        console.groupEnd();
      }

      // ✅ Register success -> go to login (token should be saved on login)
      navigate("/login", {
        replace: true,
        state: {
          email: payload.email,
          phone: payload.phone,
          registered: true,
        },
      });
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create your account
              </h1>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="e.g. Wairimu Kimani"
                  autoComplete="name"
                  error={errors.name}
                  disabled={isLoading}
                />

                <Input
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  error={errors.email}
                  disabled={isLoading}
                />

                <Input
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder="e.g. +2547XXXXXXXX"
                  autoComplete="tel"
                  inputMode="tel"
                  error={errors.phone}
                  disabled={isLoading}
                />

                <div className="sm:col-span-2">
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
                      placeholder="Create a password"
                      autoComplete="new-password"
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

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={[
                          "h-full rounded-full transition-all",
                          passwordStrength.score <= 2
                            ? "bg-rose-500"
                            : passwordStrength.score === 3
                            ? "bg-amber-500"
                            : "bg-emerald-500",
                        ].join(" ")}
                        style={{ width: `${passwordStrength.percent}%` }}
                      />
                    </div>
                    <span className="min-w-14 text-right text-xs font-medium text-slate-600">
                      {passwordStrength.label}
                    </span>
                  </div>

                  {errors.password ? (
                    <p className="mt-1.5 text-xs text-rose-700">{errors.password}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-500">
                      Use 8+ characters. Add numbers/symbols for a stronger password.
                    </p>
                  )}
                </div>

                <Input
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  error={errors.confirmPassword}
                  disabled={isLoading}
                  className="sm:col-span-2"
                />
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isLoading}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
                />
                <span className="text-sm text-slate-700">
                  I agree to the{" "}
                  <Link to="/terms" className="font-semibold text-indigo-600 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-semibold text-indigo-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Spinner className="h-5 w-5" />
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            By continuing, you acknowledge that you have read and understood our policies.
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
  className?: string;
}) {
  const {
    label,
    value,
    onChange,
    placeholder,
    autoComplete,
    inputMode,
    type = "text",
    error,
    disabled,
    className,
  } = props;

  const id = useMemo(() => `field-${label.toLowerCase().replace(/\s+/g, "-")}`, [label]);

  return (
    <div className={className}>
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