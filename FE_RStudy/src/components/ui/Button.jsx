import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "border border-line bg-white text-ink hover:border-line-strong hover:bg-primary/10",
  outline: "border border-primary text-primary hover:bg-primary/10",
  ghost: "text-ink hover:bg-primary/10",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const SIZES = {
  md: "h-11 px-5",
  lg: "h-12 px-6",
};

export default function Button({ variant = "primary", size = "md", loading = false, disabled = false, type = "button", className = "", children, ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
