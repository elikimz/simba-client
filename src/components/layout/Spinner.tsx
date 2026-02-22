// src/components/Spinner.tsx

import clsx from "clsx";

type SpinnerProps = {
  className?: string;     // size & color via Tailwind (e.g. "h-5 w-5 text-white")
  label?: string;         // accessible label (screen readers)
};

export default function Spinner({ className, label = "Loading..." }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" aria-label={label} className="inline-flex">
      <svg
        viewBox="0 0 24 24"
        className={clsx(
          "animate-spin",
          "h-5 w-5",
          "text-current",
          className
        )}
        fill="none"
      >
        {/* Background circle */}
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />

        {/* Foreground arc */}
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      {/* Screen-reader only text */}
      <span className="sr-only">{label}</span>
    </span>
  );
}