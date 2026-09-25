const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  accent: "bg-accent text-ink hover:bg-accent-dark",
  ghost: "bg-transparent text-ink hover:bg-ink/5 border border-line",
  danger: "bg-danger text-white hover:bg-danger-dark",
};

export default function Button({
  variant = "primary",
  className = "",
  disabled,
  loading,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5
        text-sm font-semibold transition-colors duration-150
        disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
