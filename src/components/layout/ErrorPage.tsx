import React from "react";
import { FaHome, FaRedoAlt } from "react-icons/fa";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "We couldn’t complete your request. Please try again.";

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : "Request error";
    message =
      error.status === 404
        ? "The page you’re looking for doesn’t exist or may have moved."
        : `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message || message;
  }

  // ✅ Debug info for production (hidden but available in DOM if needed)
  const errorStack = error instanceof Error ? error.stack : JSON.stringify(error);

  const reload = () => window.location.reload();

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white text-xl">
                ⚠️
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={reload}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
                  >
                    <FaRedoAlt className="text-sm" />
                    Reload
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
                  >
                    <FaHome className="text-sm" />
                    Home
                  </button>
                </div>

                <p className="mt-6 text-xs text-slate-400">
                  If this keeps happening, try again in a moment. 🙂 
                </p>

                {/* ✅ Debugging aid: hidden stack trace */}
                <details className="mt-8 cursor-pointer opacity-20 hover:opacity-100 transition-opacity">
                  <summary className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Technical Details
                  </summary>
                  <pre className="mt-4 overflow-auto rounded-lg bg-slate-50 p-4 text-[10px] leading-relaxed text-slate-600">
                    {errorStack}
                  </pre>
                </details>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-8 py-4 text-xs text-slate-500 flex items-center justify-between">
            <span>Status: {isRouteErrorResponse(error) ? error.status : "—"}</span>
            <span>We appreciate your patience.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;