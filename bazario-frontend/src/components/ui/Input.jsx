export default function Input({ label, error, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-xl border px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/40
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
          ${error ? "border-danger" : "border-line"} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
